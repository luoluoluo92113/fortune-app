export default async function handler(req, res) {
  const models = [
    "google/gemma-7b-it",
    "mistralai/mistral-7b-instruct",
    "meta-llama/llama-3-8b-instruct",
    "qwen/qwen-7b-chat"
  ];

  const { question } = req.body;

  for (let model of models) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://your-site.vercel.app",
          "X-Title": "AI Fortune App"
        },
        body: JSON.stringify({
          model,
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
          temperature: 0.9
        })
      });

      const data = await response.json();

      // ✅ 成功返回
      if (data.choices?.[0]?.message?.content) {
        return res.status(200).json({
          result: data.choices[0].message.content
        });
      }

      // ❌ 模型不可用 → 自动试下一个
      console.log("模型失败:", model, data.error);

    } catch (err) {
      console.log("请求失败:", model);
    }
  }

  // 🚨 所有模型都挂了
  return res.status(200).json({
    result: "🔮 今日天机紊乱，请稍后再试"
  });
}
