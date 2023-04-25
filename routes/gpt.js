const { Configuration, OpenAIApi } = require("openai");

const config = new Configuration({
  apiKey:
    process.env.OPENAI_API_KEY ||
    "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",
});

const openai = new OpenAIApi(config);

const runPrompt = async (prompt) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Fix the spelling and grammer misstakes of the following text: ${prompt}`,
      max_tokens: 500,
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });
    return response.data.choices[0].text;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = runPrompt;
