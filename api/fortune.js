export default async function handler(req, res) {
  try {
    const { question } = req.body;

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

    res.status(200).json({
      result: data.choices?.[0]?.message?.content || "天机暂不可泄露"
    });

  } catch (err) {
    res.status(200).json({
      result: "天机被屏蔽了，请稍后再试"
    });
  }
}
