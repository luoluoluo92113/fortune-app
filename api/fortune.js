export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { question } = req.body;

  const prompt = `你是一位精通易学的大师，请用通俗易懂的方式解答这个问题：${question}`;

  try {
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

    res.status(200).json({
      result: data.choices?.[0]?.message?.content || "没有返回结果",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
