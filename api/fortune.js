export default async function handler(req, res) {
  try {
    const { question } = req.body;

    const response = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.DASHSCOPE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen-plus", // ✅ 阿里云稳定模型
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

    console.log("百炼返回：", data);

    // ❗关键判断
    if (data.error) {
      return res.status(200).json({
        result: "🔮 天机受阻：" + data.error.message
      });
    }

    return res.status(200).json({
      result: data.choices?.[0]?.message?.content || "天机暂不可泄露"
    });

  } catch (err) {
    console.error("错误：", err);
    return res.status(200).json({
      result: "⚠️ 天机紊乱，请稍后再试"
    });
  }
}
