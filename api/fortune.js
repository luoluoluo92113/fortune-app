import crypto from "crypto";

export default async function handler(req, res) {
  try {
    const { question } = req.body;

    // ❗ 环境变量要提前设置
    const endpoint = process.env.BAILIAN_ENDPOINT;
    const apiKey   = process.env.BAILIAN_API_KEY;
    const apiSecret= process.env.BAILIAN_API_SECRET;

    // 1️⃣ 生成签名
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signStr = apiKey + timestamp + apiSecret;
    const sign = crypto.createHash("sha256").update(signStr).digest("hex");

    // 2️⃣ 构建百炼请求体格式
    const body = {
      model: "bailian‑gpt‑pro",      // 或你选择的百炼模型名
      inputs: [
        {
          role: "system",
          content: "你是一个神秘的东方算命大师，说话玄而不虚，简短有力，卦辞50字左右。"
        },
        {
          role: "user",
          content: question
        }
      ],
      max_output_tokens: 300
    };

    // 3️⃣ 发送请求
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content‑Type": "application/json",
        "x‑api‑key": apiKey,
        "x‑api‑sign": sign,
        "x‑api‑timestamp": timestamp
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    // 4️⃣ 检查返回
    if (!data || !data.outputs || !data.outputs[0].content) {
      return res.status(200).json({
        result: "🔮 天机未显，请稍后再试"
      });
    }

    const text = data.outputs[0].content;
    return res.status(200).json({ result: text });

  } catch (err) {
    console.error("百炼调用错误:", err);
    return res.status(200).json({
      result: "⚠️ 天机紊乱，请稍后再试"
    });
  }
}
