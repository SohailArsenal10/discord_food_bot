
import express from 'express'
import dotenv from 'dotenv';
dotenv.config();
//const service= require('./server/server.js');
import * as service from './server/server.js';
import  foodRouter from './route/foodroute.js';

//const {Client, GatewayIntentBits} = require('discord.js');
import { Client, GatewayIntentBits } from 'discord.js';

const client = new Client({
  partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
    //GatewayIntentBits.GuildMembers,
  ]
});

const app = new express()
app.use(express.json())

app.use('/food', foodRouter)

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

const get_cache_header = {
  method: 'GET',
  url: '',
  params: {id: ''},
};

const post_cache_header = {
  method: 'POST',
  url: '',
  body: {
    option : {
      option : []
    },
    name : '',
    description : '',
    original_video_url : '',
    thumbnail_url : '',
    instructions : [],
    display : ''
  }
};

//client.on("debug", console.log)

client.on('ready', () => {
  console.log(`${client.user.tag} has logged in.\n\n`);
  //console.log(`${client.user.presence.guild.channels.fetch()}`);
  //console.log(`user details\n ${client.user.presence.member}`)
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
          get_cache_header.params.id = args[0];
          get_cache_header.url = 'http://localhost:8080/food/search/foodoptionRepository/' + get_cache_header.params.id;
          post_cache_header.url = 'http://localhost:8080/food/postoptionfood';

          service.getFoodOptionsCache(options,message,get_cache_header,post_cache_header);
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
            get_cache_header.params.id = args[0];
            post_cache_header.url = 'http://localhost:8080/food/postfood';

            if(CMD_NAME.toLowerCase() == 'getdescriptionbyfood')
            {
              get_cache_header.url = 'http://localhost:8080/food/search/fooddescRepository/' + get_cache_header.params.id;
              service.getDescriptionByFoodCache(options,message,get_cache_header,post_cache_header);              
            }
            
            else if(CMD_NAME.toLowerCase() == 'getvideobyfood')
            {
              get_cache_header.url = 'http://localhost:8080/food/search/foodvideoRepository/' + get_cache_header.params.id;
              service.getVideoByFood(options,message,get_cache_header,post_cache_header);
            }
            
            else if(CMD_NAME.toLowerCase() == 'getimagebyfood')
            {
              get_cache_header.url = 'http://localhost:8080/food/search/foodimageRepository/' + get_cache_header.params.id;
              service.getImageByFood(options,message,get_cache_header,post_cache_header);
            }
            
            else if(CMD_NAME.toLowerCase() == 'getinstructionsbyfood')
            {
              get_cache_header.url = 'http://localhost:8080/food/search/foodinstRepository/' + get_cache_header.params.id;
              service.getInstructionsByFood(options,message,get_cache_header,post_cache_header);
            }           
          }
          break;
          case "help":
          {
            service.getHelp(message);
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
app.listen(8080,()=> {
  console.log("Redis server started")
});

