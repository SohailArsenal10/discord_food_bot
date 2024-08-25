const calculateElement = (obj, arr_j, inst) => {
  var temp = "";
  switch (arr_j) {
    case 0:
      temp = obj.name;
      break;
    case 1:
      temp = obj.description;
      break;
    case 2:
      temp = obj.original_video_url;
      break;
    case 3:
      temp = obj.thumbnail_url;
      break;
    case 4:
      temp = obj.display;
      break;
    case 5:
      temp = inst;
      break;
  }
  return temp;
};

const printFood = (map1, message, options) => {
  //var respsize = options ? 4000 : 2000;
  var map2 = Array.from(map1).slice(0, Number(options.params.size));
  console.log("\n\nSize is \n" + Number(options.params.size));
  console.log("\n\nLimited Response is \n", map2);
  if (map1.size) {
    if (!options.params.size)
      var output = Array.from(map1, ([k, v]) => `${k}---->\n${v}`).join(
        "\n\n\n",
      );
    else
      var output = Array.from(map2, ([k, v]) => `${k}---->\n${v}`).join(
        "\n\n\n",
      );
    if (output.length > 2000) {
      message
        .reply(
          "Please enter number option for your command at the last which should be less than or equal to 3\nFor more details, type $help",
        )
        .then(() =>
          console.log(`Replied to message from api "${message.content}"`),
        )
        .catch(console.error);
    } else {
      message
        .reply(output)
        .then(() =>
          console.log(`Replied to message from api "${message.content}"`),
        )
        .catch(console.error);
    }

    //console.log("\n\nResponse is \n" +output)
    console.log("Saving to cache....");
  } else {
    message
      .reply("Food not found")
      .then(() => console.log(`Replied to message "${message.content}"`))
      .catch(console.error);
  }
};

export { calculateElement, printFood };
