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

        //console.log("\n foodapiresponsejson = \t", responsejson);
     if(responsejson.results.length) // Object.keys(responsejson).length
     {
        var foodoptionsresp = responsejson.results;
        foodoptionsresp.forEach(obj => {
          foodoptionsarr.push(obj.display);
        });

        console.log("\n foodoptionsarr.length = \t", foodoptionsarr.length);
      if(foodoptionsarr.length) //foodoptionsarr.length > 0
      {
          var output = foodoptionsarr.map( (e,i) => (i+1+"."+e) ).join('\n');
        message.reply(output)
          .then(() => console.log(`Replied to message from api "${message.content}"`))
          .catch(console.error);
          console.log("\n\nResponse is \n" +output)
          console.log("Saving to cache....");
      }       
      else
      {
            message.reply("Food not found")
            .then(() => console.log(`Replied to message "${message.content}"`))
            .catch(console.error);
      }
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

const saveCache = (post_cache_header,foodtype) => {      
  axios.post(post_cache_header.url,post_cache_header.body)
  .then((response) => {
    return response.data;})
  .then((responsejson)=>{         

    console.log("\n savecacheresponsejson = \t", responsejson);
    switch(foodtype) //Object.keys(responsejson).length
    {
      case "name" : responsejson.option ?  console.log("Name Data saved to cache") : console.log("Empty Name data"); break;
      case "desc" : responsejson.description ?  console.log("Description Data saved to cache") : console.log("Empty Description data"); break;
      case "vid" : responsejson.original_video_url ?  console.log("Video Data saved to cache") : console.log("Empty Video data"); break;
      case "thumb" : responsejson.thumbnail_url ?  console.log("Photo Thumbnail Data saved to cache") : console.log("Empty Photo Thumbnail data"); break;
      case "display" : responsejson.display ?  console.log("Display Data saved to cache") : console.log("Empty Display data"); break;
    }

  }).catch(function (error) {
    console.error(error);
  })
  .finally(() => {
      console.log("End of save to cache call ");
  });
}

const getFoodOptionsCache = (options,message,get_cache_header,post_cache_header) => {    
  var foodoptionsarr = [];
  
  axios.request(get_cache_header)
  .then((response) => {
    return response.data;})
  .then((responsejson)=>{

    //console.log("\n cachedbresponsejson = \t", responsejson);
  if(responsejson.length) //Object.keys(responsejson).length
  {
    var foodoptionsresp = responsejson;
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
    post_cache_header.body.FoodOptions.option = foodoptionsarr;
    //console.log("\n post_cache_header type is \n" + Array.isArray(post_cache_header.body.FoodOptions.option) + "\n\n" + typeof post_cache_header.body.option)
    saveCache(post_cache_header,"name");
    }).catch(function (error) {
      console.error(error);
    })
  }

  }).catch(function (error) {
    console.error(error);
  })
  .finally(() => {
      console.log("End of cache call");
  });
}

const calculateElement = (obj, arr_j) => {
  var temp = "";
  switch(arr_j)
              {
                case 0 : temp = obj.name; break;
                case 1 : temp = obj.description; break;
                case 2 : temp = obj.original_video_url; break;
                case 3 : temp = obj.thumbnail_url; break;
                case 4 : temp = obj.display; break;
              }
     return temp;         
}
const getFood = (options,message,size,foodtype) => {
  var map_name = new Map();
  var map_desc = new Map();
  var map_vid = new Map();
  var map_thumb = new Map();
  var map_display = new Map();
  var fooddescriptionarrres = [];
  var fooddescriptionarrres1 = [];
  var arr_i = 0, arr_j = 0;
  var map_index = 0;

  fooddescriptionarrres1 = axios.request(options)
  .then((response) => {
    return response.data;})
  .then((responsejson)=>{

        //console.log("\n foodapiresponsejson = \t", responsejson);
  if(responsejson.results.length) //Object.keys(responsejson).length
  {
    var fooddescriptionresp = responsejson.results;

    fooddescriptionresp.forEach(obj => {
      if(obj.name.toLowerCase().includes(options.params.q.toLowerCase()) && (obj.description.length > 0 || !!obj.description) && !obj.description.startsWith(' '))
      {
        map_name.set(map_index,obj.name);
        map_desc.set(map_index,obj.description);
        map_vid.set(map_index,obj.original_video_url);
        map_thumb.set(map_index,obj.thumbnail_url);
        map_display.set(map_index,obj.display);   
        map_index++;             
              
            fooddescriptionarrres[arr_i] = [];  
                for(arr_j = 0; arr_j < size; arr_j++)
                {                  
                  fooddescriptionarrres[arr_i][arr_j] = calculateElement(obj,arr_j);
                }
                arr_i++;            
      }
       
    });
    switch(foodtype)
    {
      case "desc" : printFood(map_desc,message,options); break;
      case "vid" : printFood(map_vid,message,options); break;
      case "thumb" : printFood(map_thumb,message,options); break;
      case "display" : printFood(map_display,message,options); break;
    }
  }
    return fooddescriptionarrres;
    
  }).catch(function (error) {
    console.error(error);
  })
  .finally(() => {
      console.log("End of api call");
  });

  return fooddescriptionarrres1;

}

const printFood = (map1,message,options) => {

  var map2 = Array.from(map1).slice(0,Number(options.params.size));
    if(map1.size)
    {
      if(!options.params.size)
      var output = Array.from(map1, ([k,v]) => `${k}---->${v}`).join('\n\n\n');
      else
          var output = Array.from(map2, ([k,v]) => `${k}---->${v}`).join('\n\n\n');
          if(output.length > 2000)
            {          
              message.reply("Please enter number option for your command at the last which should be less than or equal to 3\nFor more details, type $help")
              .then(() => console.log(`Replied to message from api "${message.content}"`))
              .catch(console.error);
            }
            else
            {
              message.reply(output)
              .then(() => console.log(`Replied to message from api "${message.content}"`))
              .catch(console.error);
            }        

          console.log("\n\nResponse is \n" +output)
          console.log("Saving to cache....");
         
    }
    else
    {
      message.reply("Food not found")
      .then(() => console.log(`Replied to message "${message.content}"`))
      .catch(console.error);  
    }
}

const getDescriptionByFoodCache = (options,message,get_cache_header,post_cache_header) => {
    var map1 = new Map();
    var map2 = new Map();   
    var foodobjsize = Object.keys(post_cache_header.body.Food).length; 
  
    axios.request(get_cache_header)
    .then((response) => {
      return response.data;})
    .then((responsejson)=>{

    //console.log("\n cachedbresponsejson = \t", responsejson);
    if(responsejson.length) //Object.keys(responsejson).length
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
                
        console.log("\n\n\n output is \n", output1)//output1.length
        if(output1.length > 2000)
        {          
          message.reply("Please enter number option for your command at the last which should be less than or equal to 3\nFor more details, type $help")
          .then(() => console.log(`Replied to message from cache "${message.content}"`))
          .catch(console.error);
        }
        else
        {
          message.reply(output1)
          .then(() => console.log(`Replied to message from cache "${message.content}"`))
          .catch(console.error);
        }   
      }
    }
    else
    {
      console.log("\n Calling api as data not found in cache\n");
      getFood(options,message,foodobjsize,"desc").then((fooddescriptionarrres) => {

            fooddescriptionarrres.forEach((arr) => {
              post_cache_header.body.Food.name = arr[0];
              post_cache_header.body.Food.description = arr[1];
              post_cache_header.body.Food.original_video_url = arr[2];
              post_cache_header.body.Food.thumbnail_url = arr[3];
              post_cache_header.body.Food.display = arr[4];
              //console.log("\n\npost cache header = \n\n", post_cache_header.body.Food)
              saveCache(post_cache_header,"desc");
            })                
      }).catch(function (error) {
        console.error(error);
      }) 
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
  var foodobjsize = Object.keys(post_cache_header.body.Food).length; 
  axios.request(get_cache_header)
  .then((response) => {
    return response.data;})
  .then((responsejson)=>{
    
  if(responsejson.length) //   responsejson.length > 0 or Object.keys(responsejson).length
  {
    var foodvideoresp = responsejson.results;
    foodvideoresp.forEach(obj => {
      if(obj.name.toLowerCase().includes(options.params.q.toLowerCase()) && !!obj.original_video_url)
      {
        foodvideodict[obj.name] = obj.original_video_url;
      }
      
    });

    if(Object.getOwnPropertyNames(foodvideodict).length)
    {
      if(!options.params.size)
      var output = Object.entries(foodvideodict).map(([k,v]) => `${k}--->${v}`).join('\n\n\n');
      else
      var output = Object.entries(foodvideodict).slice(0,Number(options.params.size)).map(([k,v]) => `${k}--->${v}`).join('\n\n\n');
   
      if(output.length > 2000)
        {          
          message.reply("Please enter number option for your command at the last which should be less than or equal to 3\nFor more details, type $help")
          .then(() => console.log(`Replied to message from cache "${message.content}"`))
          .catch(console.error);
        }
        else
        {
          message.reply("Click on the below links to watch the videos\n\n") 
        message.reply(output)
        .then(() => console.log(`Replied to message "${message.content}"`))
        .catch(console.error);
        }
    }           
  }
  else
  {
      console.log("\n Calling api as data not found in cache\n");
      getFood(options,message,foodobjsize,"vid").then((fooddescriptionarrres) => {

            fooddescriptionarrres.forEach((arr) => {
              post_cache_header.body.Food.name = arr[0];
              post_cache_header.body.Food.description = arr[1];
              post_cache_header.body.Food.original_video_url = arr[2];
              post_cache_header.body.Food.thumbnail_url = arr[3];
              post_cache_header.body.Food.display = arr[4];
              saveCache(post_cache_header,"vid");
            })
                   
      }).catch(function (error) {
        console.error(error);
      })    
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
  var foodobjsize = Object.keys(post_cache_header.body.Food).length; 
  axios.request(get_cache_header)
  .then((response) => {
    return response.data;})
  .then((responsejson)=>{
    
  if(responsejson.length) //  responsejson.length > 0 or Object.keys(responsejson).length
  {
    var foodimageresp = responsejson.results;
    foodimageresp.forEach(obj => {
      if(obj.name.toLowerCase().includes(options.params.q.toLowerCase()) && !!obj.thumbnail_url)
      {
        foodimagedict[obj.name] = obj.thumbnail_url;
      }
      
    });

    if(Object.getOwnPropertyNames(foodimagedict).length) 
    {
      if(!options.params.size)
      var output = Object.entries(foodimagedict).map(([k,v]) => `${k}--->${v}`).join('\n\n\n');
      else
      var output = Object.entries(foodimagedict).slice(0,Number(options.params.size)).map(([k,v]) => `${k}--->${v}`).join('\n\n\n');

      if(output.length > 2000)
        {          
          message.reply("Please enter number option for your command at the last which should be less than or equal to 3\nFor more details, type $help")
          .then(() => console.log(`Replied to message from cache "${message.content}"`))
          .catch(console.error);
        }
        else
        {
          message.reply("Click on the below links to see the images\n\n")     
          message.reply(output)
          .then(() => console.log(`Replied to message "${message.content}"`))
          .catch(console.error);
        }     
    }           
  }
  else
  {
      console.log("\n Calling api as data not found in cache\n");
      getFood(options,message,foodobjsize,"thumb").then((fooddescriptionarrres) => {

            fooddescriptionarrres.forEach((arr) => {
              post_cache_header.body.Food.name = arr[0];
              post_cache_header.body.Food.description = arr[1];
              post_cache_header.body.Food.original_video_url = arr[2];
              post_cache_header.body.Food.thumbnail_url = arr[3];
              post_cache_header.body.Food.display = arr[4];
              saveCache(post_cache_header,"thumb");
            })
                   
      }).catch(function (error) {
        console.error(error);
      })     
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
  var foodobjsize = Object.keys(post_cache_header.body.Food).length; 
  axios.request(get_cache_header)
  .then((response) => {
    return response.data;})
  .then((responsejson)=>{
    
    if(false) //map1.size
    {
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
      console.log("\n Calling api as data not found in cache\n");
      getFood(options,message,foodobjsize,"inst").then((fooddescriptionarrres) => {

            fooddescriptionarrres.forEach((arr) => {
              post_cache_header.body.Food.name = arr[0];
              post_cache_header.body.Food.description = arr[1];
              post_cache_header.body.Food.original_video_url = arr[2];
              post_cache_header.body.Food.thumbnail_url = arr[3];
              post_cache_header.body.Food.display = arr[4];
              saveCache(post_cache_header,"inst");
            })
                   
      }).catch(function (error) {
        console.error(error);
      })     
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