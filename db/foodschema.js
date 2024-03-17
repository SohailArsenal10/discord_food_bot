
import {Schema,Repository } from 'redis-om';
import client from './client.js'


/* create a Schema for Food */
const foodSchema = new Schema('Food', {
  name: { type: 'string' },
  description: { type: 'string' },
  original_video_url: { type: 'string' },
  thumbnail_url: { type: 'string' },
  instructions: { type: 'string[]' },
  display: { type: 'string' }
})

/* use the client to create a Repository just for Food */
export const foodRepository = new Repository(foodSchema, client);

/* create the index for Food */
await foodRepository.createIndex();