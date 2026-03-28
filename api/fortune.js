export default async function handler(req, res) {
  try {
    const { question } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-site.vercel.app",
        "X-Title": "AI Fortune App"
      },
      body: JSON.stringify({
        model: "openchat/openchat-3.5", // ✅ 已修复
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

    console.log("OpenRouter返回：", data);

    if (data.error) {
      return res.status(200).json({
        result: "🔮 天机受阻：" + data.error.message
      });
    }

    return res.status(200).json({
      result: data.choices?.[0]?.message?.content || "天机暂不可泄露"
    });

  } catch (err) {
    console.error(err);
    return res.status(200).json({
      result: "⚠️ 天机紊乱，请稍后再试"
    });
  }
}
