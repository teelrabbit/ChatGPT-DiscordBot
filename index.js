// referncing enviorment varibles
require('dotenv').config();
var OPENAI_KEY = process.env.api_key;
var OPENAI_ORG = process.env.org_key;
var DISCORD_TOKEN = process.env.discord_key;
//check for env vars
if (!OPENAI_KEY) {
  console.error("Discord token not set.");
  process.exit(1);
}
console.log(`Discord token: ${token}`);
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
    console.log(message.content);
    if(message.author.bot) return; // generate a response of exactly what i said in chat
    //message.reply(`Greeting Bueller: ${message.content}`)
    const gdpResponse = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `ChatGDP is a coding helper.\n\
      HAL: Hello, I am ChatGDP. I am here to help you with your coding problems. What is the problem you are facing today? \n\
      ${message.author.username}: ${message.content}\n\
      HAL:`,
      temperature: 0.1,
      max_tokens: 3000,
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
