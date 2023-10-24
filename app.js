
require("dotenv").config();
const service= require('./server/server.js');

const {Client, GatewayIntentBits} = require('discord.js');

const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = "$";

const options = {
  method: 'GET',
  url: '',
  params: {prefix: '', q: '', size: '1'},
  headers: {
    'X-RapidAPI-Key': process.env.KEY,
    'X-RapidAPI-Host': process.env.HOST
  }
};

client.on('ready', () => {
  console.log(`${client.user.tag} has logged in.`);
});

client.on('messageCreate', async (message) => {
  //console.log(message);
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;
  if (message.content.startsWith(PREFIX)) {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
      switch(CMD_NAME.toLowerCase())
      {
        //Getting food options using parameter passed by the user 
        case "getfoodoptions":
          {
          options.url = 'https://tasty.p.rapidapi.com/recipes/auto-complete';
          options.params.prefix = args[0];          
          service.getFoodOptions(options,message);
          //console.log(typeof(options.params.size));
          }
          break;
        case "getdescriptionbyfood":
        case "getvideobyfood":
        case "getimagebyfood":
        case "getinstructionsbyfood":
          {
            options.url = 'https://tasty.p.rapidapi.com/recipes/list';
            options.params.q = args[0];
            options.params.size = args[1];

            if(CMD_NAME.toLowerCase() == 'getdescriptionbyfood')
            service.getDescriptionByFood(options,message);
            else if(CMD_NAME.toLowerCase() == 'getvideobyfood')
            service.getVideoByFood(options,message);
            else if(CMD_NAME.toLowerCase() == 'getimagebyfood')
            service.getImageByFood(options,message);
            else if(CMD_NAME.toLowerCase() == 'getinstructionsbyfood')
            service.getInstructionsByFood(options,message);;
          }
          break;
      }         
  }
  else{
    message.reply("Wrong command given");
  }
});

/*client.on("messageCreate", msg => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
})*/

client.login(process.env.TOKEN);

