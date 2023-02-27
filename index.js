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

// Prepare connection to DynamoDB ----- changes start here
const AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" }); // replace with your preferred region
const docClient = new AWS.DynamoDB.DocumentClient();

// Check for when a message on Discord is sent
client.on("messageCreate", async function (message) {
  try {
    console.log(message.content);
    if (message.author.bot) return;

    // Get the prompt from the message content
    const prompt = message.content;

    // Check if there is a cached response for the prompt in DynamoDB
    const params = {
      TableName: "GPT-Response-DB",
      Key: {
        prompt: prompt,
      },
    };
    const result = await docClient.get(params).promise();
    if (result.Item) {
      message.reply(result.Item.response);
      return;
    }

    // Otherwise, generate a new response using OpenAI
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

    // Save the new response in the chat history DynamoDB
    const putParams = {
      TableName: "GPT-Response-DB",
      Item: {
        prompt: prompt,
        response: response,
      },
    };
    await docClient.put(putParams).promise();

    message.reply(response);
  } catch (err) {
    console.log(err);
    message.reply("There was an error processing your request.");
  }
});

console.log('testenv');
// Log the bot onto Discord -- changes end here
client
  .login(process.env.discord_key)
  .then(() => {
    console.log("ChatGDP Bot is online on Discord");
  })
  .catch((error) => {
    console.error("Failed to log in to Discord:", error);
  });
