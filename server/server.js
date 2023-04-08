const axios = require("axios");

const getFoodOptions = (options,message) => {    
      var foodoptionsarr = [];
      axios.request(options)
      .then((response) => {
        return response.data;})
      .then((responsejson)=>{
        var foodoptionsresp = responsejson.results;
        console.log("JSON Response is \n" +foodoptionsresp)
        foodoptionsresp.forEach(obj => {
          foodoptionsarr.push(obj.display);
        });
        var output = foodoptionsarr.map( (e,i) => (i+1+"."+e) ).join('\n');
        message.reply(output)
          .then(() => console.log(`Replied to message "${message.content}"`))
          .catch(console.error);
      }).catch(function (error) {
        console.error(error);
      })
      .finally(() => {
          console.log("End of the call");
      });
    

}

const getDescriptionByFood = (options,message) => { 
    //var fooddescriptiondict = {};
    var map1 = new Map();
    var map2 = new Map();
    axios.request(options)
    .then((response) => {
      return response.data;})
    .then((responsejson)=>{
      var fooddescriptionresp = responsejson.results;
      //console.log("JSON Response is \n" + fooddescriptionresp)
      fooddescriptionresp.forEach(obj => {
        if(obj.name.includes(options.params.q) && obj.description.length > 0)
        {
          //fooddescriptiondict[obj.name] = obj.description;
          map1.set(obj.name,obj.description);
        }
        
      });
      //console.log("Dictionary is \n" + fooddescriptiondict);
      map2 = Array.from(map1).slice(0,Number(options.params.size));
      console.log("Map is " + map2 + map2.size + Number(options.params.size) + "\n\n");
      map2.forEach((value, key, map) => 
      {
        console.log(`${key} ---> ${value}`);
      });
      //if(Object.keys(fooddescriptiondict).length)
      if(map1.size)
      {
        if(!options.params.size)
        //var output = Object.entries(fooddescriptiondict).map(([k,v]) => `${k}--->${v}`).join('\n\n\n');
        var output1 = Array.from(map1, ([k,v]) => `${k}---->${v}`).join('\n\n\n');
        else
            //var output = Object.entries(fooddescriptiondict).slice(0,Number(options.params.size)).map(([k,v]) => `${k}--->${v}`).join('\n\n\n');
            var output1 = Array.from(map2, ([k,v]) => `${k}---->${v}`).join('\n\n\n');
                
        console.log("\n\n\n output is \n" + output1 + "\n\n" + output1.length)
        //console.log("\n\n\n params size is " + options.params.size)
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
      else
      {
        message.reply("Food not found")
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

const getVideoByFood = (options,message) => { 
  var foodvideodict = {};
  axios.request(options)
  .then((response) => {
    return response.data;})
  .then((responsejson)=>{
    var foodvideoresp = responsejson.results;
    //console.log("JSON Response is \n" + foodvideoresp)
    foodvideoresp.forEach(obj => {
      if(obj.name.includes(options.params.q) && !!obj.original_video_url)
      {
        foodvideodict[obj.name] = obj.original_video_url;
      }
      
    });
    //console.log("Dictionary is \n" + foodvideodict);

    if(Object.keys(foodvideodict).length)
    {
      if(!options.params.size)
      var output = Object.entries(foodvideodict).map(([k,v]) => `${k}--->${v}`).join('\n\n\n');
      else
      var output = Object.entries(foodvideodict).slice(0,Number(options.params.size)).map(([k,v]) => `${k}--->${v}`).join('\n\n\n');

      //console.log("\n\n\n output is \n" + output + "\n\n" + output.length)
      //console.log("\n\n\n params size is " + options.params.size)     
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

const getImageByFood = (options,message) => { 
  var foodimagedict = {};
  axios.request(options)
  .then((response) => {
    return response.data;})
  .then((responsejson)=>{
    var foodimageresp = responsejson.results;
    //console.log("JSON Response is \n" + foodimageresp)
    foodimageresp.forEach(obj => {
      if(obj.name.includes(options.params.q) && !!obj.thumbnail_url)
      {
        foodimagedict[obj.name] = obj.thumbnail_url;
      }
      
    });
    //console.log("Dictionary is \n" + foodimagedict);

    if(Object.keys(foodimagedict).length)
    {
      if(!options.params.size)
      var output = Object.entries(foodimagedict).map(([k,v]) => `${k}--->${v}`).join('\n\n\n');
      else
      var output = Object.entries(foodimagedict).slice(0,Number(options.params.size)).map(([k,v]) => `${k}--->${v}`).join('\n\n\n');

      //console.log("\n\n\n output is \n" + output + "\n\n" + output.length)
      //console.log("\n\n\n params size is " + options.params.size) 
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
const getInstructionsByFood = (options,message) => { 
  var map1 = new Map();
  var map2 = new Map();
  axios.request(options)
  .then((response) => {
    return response.data;})
  .then((responsejson)=>{
    var foodinstructionresp = responsejson.results;
    //console.log("JSON Response is \n" + foodinstructionresp)
    foodinstructionresp.forEach(obj => {
      if(obj.name.includes(options.params.q) && !!obj.instructions)
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

module.exports.getFoodOptions = getFoodOptions;
module.exports.getDescriptionByFood = getDescriptionByFood;  
module.exports.getVideoByFood = getVideoByFood;
module.exports.getImageByFood = getImageByFood;
module.exports.getInstructionsByFood = getInstructionsByFood;
//.slice(0,Number(options.params.size))   Object.entries(map).map(([k,v]) => `${k}_${v}`);

