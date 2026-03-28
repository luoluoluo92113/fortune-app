export default async function handler(req, res) {
  try {
    const { question } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-7b-it:free", // ✅ 最稳
        messages: [
          {
            role: "system",
            content: "你是一个神秘东方算命大师，说话简短、玄学一点。"
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

    // 👉 统一错误处理（关键）
    if (!data.choices) {
      throw new Error(data.error?.message || "模型错误");
    }

    res.status(200).json({
      result: data.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    res.status(200).json({
      result: "🍀 小吉：天机未明，静待时机"
    });
  }
}
