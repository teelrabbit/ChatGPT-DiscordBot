// Referencing environment variables

// Check for environment variables
console.log(process.env.discord_key);
if (!process.env.discord_key) {
  console.error("Discord token not set.");
  process.exit(0);
}

const AWS = require("aws-sdk");
AWS.config.update({ region: "us-west-2" });
const documentClient = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = "gdp_prompt_response";

// GDP suggestion
// Create a discord bot using OpenAI that interacts on the Discord server
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

// Check for when a message on discord is sent
client.on("messageCreate", async function (message) {
  try {
    console.log(message.content);
    if (message.author.bot) return; // Generate a response of exactly what I said in chat
    // Check if the message exists in DynamoDB
    const response = await checkMessageInDynamoDB(message.content);
    if (response) {
      message.reply(response);
      return;
    }

    // If not found in DynamoDB, generate a response using OpenAI API
    const gdpResponse = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `I am Elon Musk. I am here to answer your code questions. What would you like to know? \n\
      ${message.author.username}: ${message.content}\n\
      HAL:`,
      temperature: 0.1,
      max_tokens: 3000,
      stop: ["HAL:", "F.Bueller:"],
    });

    message.reply(`${gdpResponse.data.choices[0].text}`);
    return;
  } catch (err) {
    console.log(err);
  }
});

// Log the bot onto discord
client.login(process.env.discord_key)
  .then(() => {
    console.log("ChatGDP Bot is online on Discord");
  })
  .catch((error) => {
    console.error("Failed to log in to Discord:", error);
  });

async function checkMessageInDynamoDB(message) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      prompt: message,
    },
  };

  try {
    const result = await documentClient.get(params).promise();
    if (result.Item) {
      return result.Item.response;
}
return null;
} catch (err) {
console.error(err);
return null;
}
}
