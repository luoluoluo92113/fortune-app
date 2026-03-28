export default async function handler(req, res) {
  try {
    const { question } = req.body || {};

    const prompt = `
你是一位算命大师，请用通俗易懂的话回答用户问题：

问题：${question || "未提供"}

请给出简短有趣的解读（100字以内）。
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    // 👇 关键：一定要返回 JSON
    res.status(200).json({
      result: data.choices?.[0]?.message?.content || "算不出来了 🤯",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
