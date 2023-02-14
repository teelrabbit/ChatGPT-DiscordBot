// referncing enviorment varibles

//check for env vars
if (!process.env.discord_key) {
  console.error("Discord token read as undefined.");
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
  //Create connection to SQL Database
  //const mysql = require('mysql2');

  //const connection = mysql.createConnection({
    //host: process.env.RDS_HOSTNAME,
    //user: process.env.RDS_USERNAME,
    //password: process.env.RDS_PASSWORD,
    //database: process.env.RDS_DB_NAME,
    //port: process.env.RDS_PORT
  //});  

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
        max_tokens: 4000,
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
  .then(() => {
      console.log("ChatGDP Bot is online on Discord")
  })
  .catch((error) => {
      console.error("Failed to log in to Discord:", error)
  })
  
  
  
