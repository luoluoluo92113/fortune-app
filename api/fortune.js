export default async function handler(req, res) {
  // 👉 只允许 POST（防止乱请求）
  if (req.method !== "POST") {
    return res.status(405).json({ result: "只支持 POST 请求" });
  }

  try {
    const { question } = req.body || {};

    if (!question) {
      return res.status(200).json({
        result: "你未提出问题，天机难测 🤔"
      });
    }

    // 👉 超时控制（8秒）
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "你是一个算命大师，说话神秘一点但通俗易懂"
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.8
      }),
    });

    clearTimeout(timeout);

    const data = await response.json();
    console.log("OPENAI返回：", data);

    // 👉 API错误兜底
    if (!response.ok || data.error) {
      return res.status(200).json({
        result: "天机被遮蔽了 🔮，稍后再试"
      });
    }

    const result =
      data.choices?.[0]?.message?.content ||
      "卦象混乱，暂时无法解读 🤯";

    res.status(200).json({ result });

  } catch (err) {
    console.error("错误：", err);

    // 👉 超时 / 崩溃兜底
    res.status(200).json({
      result: "天机推演中断了 ⏳，请再试一次"
    });
  }
}
