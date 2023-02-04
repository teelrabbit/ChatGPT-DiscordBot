// Referencing environment variables

// Check for environment variables
console.log(process.env.discord_key);
if (!process.env.discord_key) {
  console.error("Discord token not set.");
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

// Connect to Amazon DynamoDB
const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB({
  region: "us-east-1",
});

// Check for when a message on Discord is sent
client.on("messageCreate", async function (message) {
  try {
    console.log(message.content);
    if (message.author.bot) return; // generate a response of exactly what i said in chat

    // Check if the message content is already in the DynamoDB table
    const result = await ddb
      .getItem({
        TableName: "discord-bot-responses",
        Key: {
          message: {
            S: message.content,
          },
        },
      })
      .promise();

    let response;
    if (result.Item) {
      response = result.Item.response.S;
    } else {
      // Call OpenAI API if the message content is not in the DynamoDB table
      const gdpResponse = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `I am Elon Musk. I am here to answer your code questions. What would you like to know? \n\
        ${message.author.username}: ${message.content}\n\
        HAL:`,
        temperature: 0.1,
        max_tokens: 3000,
        stop: ["HAL:", "F.Bueller:"],
      });
  
      response = gdpResponse.data.choices[0].text;

      // Store the message content and response in the DynamoDB table
      await ddb
        .putItem({
          TableName: "discord-bot-responses",
          Item: {
            message: {
              S: message.content,
            },
            response: {
              S: response,
            },
          },
        })
        .promise();
    }

    message.reply(response);
    return;
  } catch (err) {
    console.log(err);
  }
});

// Log the bot onto Discord
client.login(process.env.discord_key)
.then(() => {
    console.log("ChatGDP Bot is online on Discord")
})
.catch((error) => {
    console.error("Failed to log in to Discord:", error)
})