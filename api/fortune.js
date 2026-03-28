export default async function handler(req, res) {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(200).json({
        result: "你还没问问题呢 🤔"
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "你是一个神秘的东方算命大师，说话要玄一点，简短一点。"
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();

    // 🔥 关键：打印错误（Vercel Logs能看到）
    console.log("OpenAI返回：", data);

    // ❗ 如果 API 报错
    if (data.error) {
      return res.status(200).json({
        result: "🔮 天机受阻：" + data.error.message
      });
    }

    // ✅ 正常返回
    return res.status(200).json({
      result: data.choices?.[0]?.message?.content || "天机暂不可泄露"
    });

  } catch (err) {
    console.error("服务器错误：", err);

    return res.status(200).json({
      result: "⚠️ 天机紊乱，请稍后再试"
    });
  }
}
