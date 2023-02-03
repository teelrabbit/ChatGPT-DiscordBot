// referncing enviorment varibles

//check for env vars
//console.log(process.env.discord_key);
if (!process.env.discord_key) {
console.error("Bot running, but discord token can not be read");
//console.log(process.env.discord_key);
//console.log(process.env.org_key);
process.exit(0);
}
//gdp suggestion
//Create a discord bot using OpenAI that interacts on the Discord server
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
  organization: process.env.org_key,
  apiKey: process.env.api_key,
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
      prompt: `I am Elon Musk. I am here to answer your code questions. What would you like to know? \n\
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
client.login(process.env.discord_key)
console.log("ChatGDP Bot is online on Discord")
