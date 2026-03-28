body: JSON.stringify({
  model: "mistralai/mistral-7b-instruct:free",
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
