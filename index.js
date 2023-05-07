if (!process.env.discord_key || !process.env.org_key || !process.env.api_key) {
  console.error("One or more environment variables are missing.");
  process.exit(0);
}

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.org_key,
  apiKey: process.env.api_key,
});
const openai = new OpenAIApi(configuration);

client.on("messageCreate", async function (message) {
  try {
    console.log(message.content);
    if (message.author.bot) return;

    const prompt = message.content;

    const gdpResponse = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `I am Elon Musk. I am here to answer your code questions. What would you like to know? \n\
        ${prompt}\n\
        H10:`,
      temperature: 0.8,
      max_tokens: 4000,
      stop: ["H10:", "F.Bueller:"],
    });

    const response = gdpResponse.data.choices[0].text;

    message.reply(response);
  } catch (err) {
    console.log(err);
    message.reply("There was an error processing your request.");
  }
});

client
  .login(process.env.discord_key)
  .then(() => {
    console.log("ChatGDP Bot is online on Discord");
  })
  .catch((error) => {
    console.error("Failed to log in to Discord:", error);
  });
