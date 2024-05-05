import { Router } from 'express'
import { foodRepository } from '../db/foodschema.js'


const router = Router();
let food = [{
name: 'pancake',
  description: 'pancake description',
  thumbnail_url: '',
  original_video_url: 'https://pancake.com',
  instructions: ['Create Pancake batter','Put it on stove and flip it','Serve with sauce'],
  display: 'ChangePhoto'
},
{
  name: 'waffle1',
  description: 'waffle1 description',
  thumbnail_url: '',
  original_video_url: 'https://waffle1.com',
  instructions: ['Create waffle batter','Put it on stove and flip it','Serve with sauce'],
  display: 'Photo'  
},
{
  name: 'IceCreamCake',
  description: 'IceCreamCake description',
  original_video_url: 'https://IceCreamCake.com',
  thumbnail_url: 'new url',
  instructions: ['Create Cake batter','After its ready, Sandwich the icecream between the cake and cream ','Serve'],
  display: 'Photo'  
},
{
  name: 'Chicken',
  description: 'Chicken description',
  original_video_url: 'https://Chicken.com',
  thumbnail_url: 'new url',
  instructions: ['Cut Chicken','Fry it after appling batter','Serve with sauce'],
  display: 'Photo'  
}
];

let food1 = {
  name: 'waffle',
    description: 'waffle description',
    thumbnail_url: '',
    original_video_url: 'https://waffle.com',
    instructions: ['Create waffle batter','Put it on stove and flip it','Serve with sauce'],
    display: 'ChangePhoto'
  };

router.get('/:id', async (req, res) => {
  /*const person = await foodRepository.fetch(req.params.id)  //Food:01HSQQE5M9X3R5KQWSKD9A9VJC
  res.send(person)
  console.log(req.params.id);*/

  const person = await foodRepository.save(food1)
  res.send(person)
  console.log(person);
})

router.get('/', async (req, res) => {
  res.json({
    code:200
  })
})

router.post('/postfood', async (req, res) => {
  const person = await foodRepository.save(food1)
  res.send(person)
  console.log(person);
})

export default router;