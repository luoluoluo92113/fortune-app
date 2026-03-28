export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { question } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `你是一位算命大师，请分析这个问题：${question}`,
          },
        ],
      }),
    });

    const data = await response.json();

    res.status(200).json({
      result: data.choices?.[0]?.message?.content || "没有结果",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
