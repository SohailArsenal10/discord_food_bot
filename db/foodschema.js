
import {Schema,Repository } from 'redis-om';
import client from './client.js'


/* create a Schema for Food */
/*const foodSchema = new Schema('Food', {
  name: { type: 'string' , path: '$.Food.name'},
  description: { type: 'string' , path: '$.Food.description'},
  original_video_url: { type: 'string' , path: '$.Food.original_video_url'},
  thumbnail_url: { type: 'string' , path: '$.Food.thumbnail_url'},
  instructions: { type: 'string[]' , path: '$.Food.instructions[*]'},
  display: { type: 'string' , path: '$.Food.display'}

})*/
const foodoptionSchema = new Schema('FoodOptions', {
  option: { type: 'string[]'}
})

const foodSchema = new Schema('Food', {
  name: { type: 'text'},
  description: { type: 'text'},
  original_video_url: { type: 'text'},
  thumbnail_url: { type: 'text'},
  instructions: { type: 'text'},
  display: { type: 'text'}

})

/* use the client to create a Repository just for Food */
//export const foodRepository = new Repository(foodSchema, client);
const foodRepository = new Repository(foodSchema, client);
const foodoptionRepository = new Repository(foodoptionSchema, client);
export { foodoptionRepository, foodRepository};

/* create the index for Food */
await foodoptionRepository.createIndex();
await foodRepository.createIndex();