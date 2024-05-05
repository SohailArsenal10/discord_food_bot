
import {Schema,Repository } from 'redis-om';
import client from './client.js'


/* create a Schema for Food */
const foodSchema = new Schema('Food', {
  name: { type: 'string' , path: '$.Food.name'},
  description: { type: 'string' , path: '$.Food.description'},
  original_video_url: { type: 'string' , path: '$.Food.original_video_url'},
  thumbnail_url: { type: 'string' , path: '$.Food.thumbnail_url'},
  instructions: { type: 'string[]' , path: '$.Food.instructions[*]'},
  display: { type: 'string' , path: '$.Food.display'}

})

/* use the client to create a Repository just for Food */
export const foodRepository = new Repository(foodSchema, client);

/* create the index for Food */
await foodRepository.createIndex();