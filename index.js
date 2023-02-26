// check for env vars
if (!process.env.discord_key || !process.env.org_key || !process.env.api_key) {
  console.error("One or more environment variables are missing.");
  process.exit(0);
}

// Prepare to connect to the Discord API
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Prepare connection to OpenAI API
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  organization: process.env.org_key,
  apiKey: process.env.api_key,
});
const openai = new OpenAIApi(configuration);

// Check for when a message on Discord is sent
client.on("messageCreate", async function (message) {
  try {
    console.log(message.content);
    if (message.author.bot) return;

    // Check if we have a previous response for this prompt
    const prompt = `${message.author.username}: ${message.content}`;
    const previousResponse = chatHistory[prompt];

    // If we have a previous response, use it directly
    if (previousResponse) {
      message.reply(previousResponse);
      return;
    }

    // Otherwise, generate a new response using OpenAI
    const gdpResponse = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `I am Elon Musk. I am here to answer your code questions. What would you like to know? \n\
        ${prompt}\n\
        HAL:`,
      temperature: 0.1,
      max_tokens: 4000,
      stop: ["HAL:", "F.Bueller:"],
    });

    const response = gdpResponse.data.choices[0].text;

    // Save the new response in the chat history
    chatHistory[prompt] = response;

    message.reply(response);
  } catch (err) {
    console.log(err);
  }
});

// Log the bot onto Discord
client
  .login(process.env.discord_key)
  .then(() => {
    console.log("ChatGDP Bot is online on Discord");
  })
  .catch((error) => {
    console.error("Failed to log in to Discord:", error);
  });
