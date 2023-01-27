//Create a discord bot using OpenAI that interacts on the Discord server
require('dotenv').config();

//Prepare to connect to the Discord API

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
]})

//Prepare connection to OpenAI API

const { Configuration , OpenAIApi } = require ('openai');
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

//Check for when a message on discord is sent
client.on('messageCreate', async function(message){
  try {
    if(message.author.bot) return;

    const gdpResponse = await openai.createCompletion({
      model: "davinci",
      prompt: `ChatGDP is a friendly chatbot.\n\
      HAL: Hello, how are you? \n\
      ${message.author.username}: ${message.content}\n\
      HAL:`,
      tempature: 0.9,
      max_tokens: 100,
      stop: ["HAL:", "F.Bueller:"],
    })

    message.reply(`${gdpResponse.data.choices[0].text}`);
    return;
  } catch(err){
    console.log(err)
  }
});

//Log the bot onto discord
client.login(process.env.DISCORD_TOKEN)
console.log("ChatGDP Bot is online on Discord")
