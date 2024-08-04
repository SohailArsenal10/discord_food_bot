//const axios = require("axios");
import axios from 'axios';

const help_message = `Below are the commands to use for different food results (Space to be added in between)\n 
$getfoodoptions {food}- Gives options with respect to food mentioned by the user. \nExample :\n $getfoodoptions cookie (Gives all cookie options)\n\n
$getdescriptionbyfood {food} {number}- Gives description with respect to food mentioned by the user. \nExample :\n $getdescriptionbyfood pancake (Gives all pancake descriptions)\n$getdescriptionbyfood pancake 3 (Gives 3 pancakes descriptions)\n\n
$getvideobyfood {food} {number}- Gives videos with respect to food mentioned by the user. \nExample :\n $getvideobyfood chocolate (Gives all chocolate descriptions)\n$getvideobyfood pancake 5 (Gives 5 chocolate descriptions)\n\n
$getimagebyfood {food} {number}- Gives images with respect to food mentioned by the user. \nExample :\n $getimagebyfood pasta (Gives all pasta descriptions)\n$getimagebyfood pasta 2 (Gives 2 pasta descriptions)\n\n
$getinstructionsbyfood {food} {number}- Gives instructions with respect to food mentioned by the user. \nExample :\n $getinstructionsbyfood salad (Gives all salad descriptions)\n$getinstructionsbyfood salad 6 (Gives 6 salad descriptions)\n\n
Sometimes you may get less than the exact number mentioned as data may not be present. Have a nice delicacy :)
`;

axios.interceptors.request.use( x => {
  // to avoid overwriting if another interceptor
  // already defined the same object (meta)
  x.meta = x.meta || {}
  x.meta.requestStartedAt = new Date().getTime();
  return x;
})

axios.interceptors.response.use( x => {
      console.log(`Execution time for: ${x.config.url} - ${ new Date().getTime() - x.config.meta.requestStartedAt} ms`)
      return x;
  },
  // Handle 4xx & 5xx responses
  x => {
      console.error(`Execution time for: ${x.config.url} - ${new Date().getTime() - x.config.meta.requestStartedAt} ms`)
      throw x;
  }
)
var getFoodOptions = (options,message) => {    
      var foodoptionsarr = [];
      var foodoptionsarr1 = [];
      foodoptionsarr1 = axios.request(options)
      .then((response) => {
        return response.data;})
      .then((responsejson)=>{
        var foodoptionsresp = responsejson.results;
        //console.log("JSON Response is \n" +foodoptionsresp)
        foodoptionsresp.forEach(obj => {
          foodoptionsarr.push(obj.display);
        });

        if(foodoptionsarr.length > 0)
        {
          var output = foodoptionsarr.map( (e,i) => (i+1+"."+e) ).join('\n');
        /*message.reply(output)
          .then(() => console.log(`Replied to message from api "${message.content}"`))
          .catch(console.error);
          console.log("\n\nResponse is \n" +output)
          console.log("Saving to cache....");*/
        }       
        else
        {
            message.reply("Food not found")
            .then(() => console.log(`Replied to message "${message.content}"`))
            .catch(console.error);
        }
        return foodoptionsarr;
      }).catch(function (error) {
        console.error(error);
      })
      .finally(() => {
          console.log("End of api call");
      });
      return foodoptionsarr1;
}

const saveCache = (post_cache_header) => {      
  axios.post(post_cache_header.url,post_cache_header.body)
  .then((response) => {
    return response.data;})
  .then((responsejson)=>{         
    if(responsejson)
      console.log("Data saved to cache");
  }).catch(function (error) {
    console.error(error);
  })
  .finally(() => {
      console.log("End of save to cache call ");
  });
}

const getFoodOptionsCache = (options,message,get_cache_header,post_cache_header) => {    
  var foodoptionsarr = [];
  
  /*if(options_cache != null)
    options = options_cache;*/
  
  axios.request(get_cache_header)
  .then((response) => {
    return response.data;})
  .then((responsejson)=>{

    if(false)
    {
    var foodoptionsresp = responsejson;
    //console.log("JSON Response is \n" +foodoptionsresp)
    /*foodoptionsresp.forEach(obj => {
      foodoptionsarr = obj.option;
    });*/
    foodoptionsarr = foodoptionsresp[0].option;
    
    var output = foodoptionsarr.map( (e,i) => (i+1+"."+e) ).join('\n');
    message.reply(output)
      .then(() => console.log(`Replied to message from cache "${message.content}"`))
      .catch(console.error);
      console.log("\n\nResponse is \n" +output)
   }

   else
   {
    console.log("\n Calling api as data not found in cache\n");
    getFoodOptions(options,message).then((foodoptionsarr) =>
    {
    post_cache_header.body.option.option = foodoptionsarr;
    //console.log("\n post_cache_header type is \n" + Array.isArray(post_cache_header.body.option.option) + "\n\n" + typeof post_cache_header.body.option)
    saveCache(post_cache_header);
    })
   }

  }).catch(function (error) {
    console.error(error);
  })
  .finally(() => {
      console.log("End of cache call");
  });
}

const getDescriptionByFood = (options,message) => {
  var map1 = new Map();
  var map2 = new Map();
  var fooddescriptionarr = [];
  axios.request(options)
  .then((response) => {
    return response.data;})
  .then((responsejson)=>{
    
    var fooddescriptionresp = responsejson.results;
    fooddescriptionresp.forEach(obj => {
      if(obj.name.toLowerCase().includes(options.params.q.toLowerCase()) && (obj.description.length > 0 || !!obj.description) && !obj.description.startsWith(' '))
      {
        map1.set(obj.name,obj.description);
      }
      fooddescriptionarr.push(obj); 
    });
    map2 = Array.from(map1).slice(0,Number(options.params.size));
    //console.log("Map is " + map2 + map2.size + Number(options.params.size) + "\n\n");
    /*map2.forEach((value, key, map) => 
    {
      console.log(`${key} ---> ${value}`);
    });*/

    if(map1.size)
    {
      if(!options.params.size)
      var output1 = Array.from(map1, ([k,v]) => `${k}---->${v}`).join('\n\n\n');
      else
          var output1 = Array.from(map2, ([k,v]) => `${k}---->${v}`).join('\n\n\n');
              
      console.log("\n\n\n output is \n" + output1 + "\n\n" + output1.length)
         
    }
    else
    {
      message.reply("Food not found")
      .then(() => console.log(`Replied to message "${message.content}"`))
      .catch(console.error);  
    }
    return fooddescriptionarr;
    
  }).catch(function (error) {
    console.error(error);
  })
  .finally(() => {
      console.log("End of api call");
  });

}

const getDescriptionByFoodCache = (options,message,get_cache_header,post_cache_header) => {
    var map1 = new Map();
    var map2 = new Map();    
    axios.request(get_cache_header)
    .then((response) => {
      return response.data;})
    .then((responsejson)=>{
      
    if(responsejson)
    {
      var fooddescriptionresp = responsejson;
      fooddescriptionresp.forEach(obj => {
        if(obj.name.toLowerCase().includes(options.params.q.toLowerCase()) && (obj.description.length > 0 || !!obj.description) && !obj.description.startsWith(' '))
        {
          map1.set(obj.name,obj.description);
        }             
      });
      map2 = Array.from(map1).slice(0,Number(options.params.size));
      //console.log("Map is " + map2 + map2.size + Number(options.params.size) + "\n\n");
      /*map2.forEach((value, key, map) => 
      {
        console.log(`${key} ---> ${value}`);
      });*/

      if(map1.size)
      {
        if(!options.params.size)
        var output1 = Array.from(map1, ([k,v]) => `${k}---->${v}`).join('\n\n\n');
        else
            var output1 = Array.from(map2, ([k,v]) => `${k}---->${v}`).join('\n\n\n');
                
        console.log("\n\n\n output is \n" + output1 + "\n\n" + output1.length)
        /*if(output1.length > 4000)
        {          
          message.reply("Please enter number option at the last which should be less than or equal to 3")
          .then(() => console.log(`Replied to message "${message.content}"`))
          .catch(console.error);
        }
        else
        {
          message.reply(output1)
          .then(() => console.log(`Replied to message "${message.content}"`))
          .catch(console.error);
        } */    
      }
    }
    else
    {
      var fooddescriptionarr = getDescriptionByFood(options,message);
      fooddescriptionarr.forEach(obj => {
        post_cache_header.body = obj;
        saveCache(post_cache_header);           
      });      
    }      
    }).catch(function (error) {
      console.error(error);
    })
    .finally(() => {
        console.log("End of cache call");
    });
  
}

const getVideoByFoodCache = (options,message,get_cache_header,post_cache_header) => { 
  var foodvideodict = {};
  axios.request(options)
  .then((response) => {
    return response.data;})
  .then((responsejson)=>{
    
    var foodvideoresp = responsejson.results;
    foodvideoresp.forEach(obj => {
      if(obj.name.toLowerCase().includes(options.params.q.toLowerCase()) && !!obj.original_video_url)
      {
        foodvideodict[obj.name] = obj.original_video_url;
      }
      
    });

    if(Object.keys(foodvideodict).length)
    {
      if(!options.params.size)
      var output = Object.entries(foodvideodict).map(([k,v]) => `${k}--->${v}`).join('\n\n\n');
      else
      var output = Object.entries(foodvideodict).slice(0,Number(options.params.size)).map(([k,v]) => `${k}--->${v}`).join('\n\n\n');
   
        message.reply("Click on the below links to watch the videos\n\n") 
        message.reply(output)
        .then(() => console.log(`Replied to message "${message.content}"`))
        .catch(console.error);           
    }
    else
    {
      message.reply("Food videos not found")
      .then(() => console.log(`Replied to message "${message.content}"`))
      .catch(console.error);    
    }
    
  }).catch(function (error) {
    console.error(error);
  })
  .finally(() => {
      console.log("End of the call");
  });

}

const getImageByFoodCache = (options,message,get_cache_header,post_cache_header) => { 
  var foodimagedict = {};
  axios.request(options)
  .then((response) => {
    return response.data;})
  .then((responsejson)=>{
    
    var foodimageresp = responsejson.results;
    foodimageresp.forEach(obj => {
      if(obj.name.toLowerCase().includes(options.params.q.toLowerCase()) && !!obj.thumbnail_url)
      {
        foodimagedict[obj.name] = obj.thumbnail_url;
      }
      
    });

    if(Object.keys(foodimagedict).length)
    {
      if(!options.params.size)
      var output = Object.entries(foodimagedict).map(([k,v]) => `${k}--->${v}`).join('\n\n\n');
      else
      var output = Object.entries(foodimagedict).slice(0,Number(options.params.size)).map(([k,v]) => `${k}--->${v}`).join('\n\n\n');

        message.reply("Click on the below links to see the images\n\n")     
        message.reply(output)
        .then(() => console.log(`Replied to message "${message.content}"`))
        .catch(console.error);           
    }
    else
    {
      message.reply("Food images not found")
      .then(() => console.log(`Replied to message "${message.content}"`))
      .catch(console.error);    
    }
    
  }).catch(function (error) {
    console.error(error);
  })
  .finally(() => {
      console.log("End of the call");
  });

}

//Usage of maps
const getInstructionsByFoodCache = (options,message,get_cache_header,post_cache_header) => { 
  var map1 = new Map();
  var map2 = new Map();
  axios.request(options)
  .then((response) => {
    return response.data;})
  .then((responsejson)=>{
    
    var foodinstructionresp = responsejson.results;
    foodinstructionresp.forEach(obj => {
      if(obj.name.toLowerCase().includes(options.params.q.toLowerCase()) && !!obj.instructions)
      {
        map1.set(obj.name, obj.instructions.map((instruction, index) => 
        {
          return index+1 + ". " + instruction.display_text
        }        
        ).join('\n'));       
      }
      
    });
    map2 = Array.from(map1).slice(0,Number(options.params.size));

    /*map1.forEach((value, key, map) => 
      {
        console.log(`${key} ---> ${value}`);
      });*/

    if(map1.size)
    {
      if(!options.params.size)
      var output = Array.from(map1, ([k,v]) => `${k}---->\n${v}`).join('\n\n\n');
      else
      var output = Array.from(map2, ([k,v]) => `${k}---->\n${v}`).join('\n\n\n');    
        
      if(output.length > 2000)
        {          
          message.reply("Please enter number option at the last which should be less than or equal to 3")
          .then(() => console.log(`Replied to message "${message.content}"`))
          .catch(console.error);
        }
      else
        { 
          message.reply(output)
          .then(() => console.log(`Replied to message "${message.content}"`))
          .catch(console.error); 
        }               
    }
    else
    {
      message.reply("Food images not found")
      .then(() => console.log(`Replied to message "${message.content}"`))
      .catch(console.error);    
    }
    
  }).catch(function (error) {
    console.error(error);
  })
  .finally(() => {
      console.log("End of the call");
  });

}

const getHelp = (message) => {
  message.reply(help_message)
  .then(() => console.log(`Replied to message "${message.content}"`))
  .catch(console.error);
}

/*
module.exports.getFoodOptions = getFoodOptions;
module.exports.getDescriptionByFood = getDescriptionByFood;  
module.exports.getVideoByFood = getVideoByFood;
module.exports.getImageByFood = getImageByFood;
module.exports.getInstructionsByFood = getInstructionsByFood;
module.exports.getHelp = getHelp;*/

export { getFoodOptionsCache, getDescriptionByFoodCache, getVideoByFoodCache, getImageByFoodCache, getInstructionsByFoodCache, getHelp};