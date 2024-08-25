import axios from "axios";
import Enums from "../enum.js";
import * as helper from "./helper.js";

var getFoodOptions = (options, message) => {
  var foodoptionsarr = [];
  var foodoptionsarr1 = [];
  foodoptionsarr1 = axios
    .request(options)
    .then((response) => {
      return response.data;
    })
    .then((responsejson) => {
      //console.log("\n foodapiresponsejson = \t", responsejson);
      if (responsejson.results.length) {
        // Object.keys(responsejson).length
        var foodoptionsresp = responsejson.results;
        foodoptionsresp.forEach((obj) => {
          foodoptionsarr.push(obj.display);
        });

        console.log("\n foodoptionsarr.length = \t", foodoptionsarr.length);
        if (foodoptionsarr.length) {
          //foodoptionsarr.length > 0
          var output = foodoptionsarr.map((e, i) => i + 1 + "." + e).join("\n");
          message
            .reply(output)
            .then(() =>
              console.log(`Replied to message from api "${message.content}"`),
            )
            .catch(console.error);
          console.log("\n\nResponse is \n" + output);
          console.log("Saving to cache....");
        } else {
          message
            .reply("Food not found")
            .then(() => console.log(`Replied to message "${message.content}"`))
            .catch(console.error);
        }
      }
      return foodoptionsarr;
    })
    .catch(function (error) {
      console.error(error);
    })
    .finally(() => {
      console.log("End of api call");
    });
  return foodoptionsarr1;
};

const saveCache = (post_cache_header, foodtype) => {
  axios
    .post(post_cache_header.url, post_cache_header.body)
    .then((response) => {
      return response.data;
    })
    .then((responsejson) => {
      //console.log("\n savecacheresponsejson = \t", responsejson);
      switch (
        foodtype //Object.keys(responsejson).length
      ) {
        case Enums.NAME:
          responsejson.option
            ? console.log("Name Data saved to cache")
            : console.log("Empty Name data");
          break;
        case Enums.DESC:
          responsejson.description
            ? console.log("Description Data saved to cache")
            : console.log("Empty Description data");
          break;
        case Enums.VID:
          responsejson.original_video_url
            ? console.log("Video Data saved to cache")
            : console.log("Empty Video data");
          break;
        case Enums.THUMB:
          responsejson.thumbnail_url
            ? console.log("Photo Thumbnail Data saved to cache")
            : console.log("Empty Photo Thumbnail data");
          break;
        case Enums.DISP:
          responsejson.display
            ? console.log("Display Data saved to cache")
            : console.log("Empty Display data");
          break;
      }
    })
    .catch(function (error) {
      console.error(error);
    })
    .finally(() => {
      console.log("End of save to cache call ");
    });
};

const getFood = (options, message, size, foodtype) => {
  //var map_name = new Map();
  var map_desc = new Map();
  var map_vid = new Map();
  var map_thumb = new Map();
  var map_display = new Map();
  var map_inst = new Map();
  var inst = "";
  var fooddescriptionarrres = [];
  var fooddescriptionarrres1 = [];
  var arr_i = 0,
    arr_j = 0;
  //var map_index = 0;

  fooddescriptionarrres1 = axios
    .request(options)
    .then((response) => {
      return response.data;
    })
    .then((responsejson) => {
      //console.log("\n foodapiresponsejson = \t", responsejson);
      if (responsejson.results.length) {
        //Object.keys(responsejson).length
        var fooddescriptionresp = responsejson.results;

        fooddescriptionresp.forEach((obj) => {
          if (
            obj.name.toLowerCase().includes(options.params.q.toLowerCase()) &&
            (!!obj.description || obj.description.length > 0) &&
            !obj.description.startsWith(" ")
          ) {
            inst = obj.instructions
              .map((instruction, index) => {
                return index + 1 + ". " + instruction.display_text;
              })
              .join("\n");

            //map_name.set(map_index,obj.name);
            map_desc.set(obj.name, obj.description);
            map_vid.set(obj.name, obj.original_video_url);
            map_thumb.set(obj.name, obj.thumbnail_url);
            map_display.set(obj.name, obj.display);
            map_inst.set(obj.name, inst);
            //map_index++;

            fooddescriptionarrres[arr_i] = [];
            for (arr_j = 0; arr_j < size; arr_j++) {
              fooddescriptionarrres[arr_i][arr_j] = helper.calculateElement(
                obj,
                arr_j,
                inst,
              );
            }
            arr_i++;
          }
        });
        switch (foodtype) {
          case Enums.DESC:
            helper.printFood(map_desc, message, options);
            break;
          case Enums.VID:
            helper.printFood(map_vid, message, options);
            break;
          case Enums.THUMB:
            helper.printFood(map_thumb, message, options);
            break;
          case Enums.DISP:
            helper.printFood(map_display, message, options);
            break;
          case Enums.INST:
            helper.printFood(map_inst, message, options);
            break;
        }
      }
      return fooddescriptionarrres;
    })
    .catch(function (error) {
      console.error(error);
    })
    .finally(() => {
      console.log("End of api call");
    });

  return fooddescriptionarrres1;
};

export { getFoodOptions, getFood, saveCache };
