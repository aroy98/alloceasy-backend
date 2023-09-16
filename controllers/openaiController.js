const axios = require("axios");
const OpenAI = require("openai");

module.exports = {
  openai: () => {
    return new OpenAI({
      apiKey: "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",
    });
  },

  prompt: async (req, res) => {
    const { content } = req.body;
    console.log({ content });
    const response = await module.exports.openai().chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content,
        },
      ],
      temperature: 1,
      max_tokens: 256,
    });
    return res.status(200).send(response);
  },
};
