import { Router } from 'express'
import { foodoptionRepository, foodRepository } from '../db/foodschema.js'


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
  name: 'pancake',
    description: 'pancake description',
    thumbnail_url: '',
    original_video_url: 'https://egg.com',
    instructions: ['Put batter','Put it on stove and flip it','Serve with syrup'],
    display: 'ChangePhoto1'
  };

  let foodoption = {
     option: ['banana waffle','blueberry waffle','waffles']
  }

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

router.get('/search/foodRepository/:id', async (req, res) => {
  //const foodall = await foodRepository.search().return.all()
  const params = req.params;
  const name = await foodRepository.search().where('name').matches(params.id).return.all()
  /*const query = "@name:{pancake}"
  const albums = await foodRepository.searchRaw(query).return.all();*/
  res.send(name)
})

router.get('/search/foodoptionRepository/:id', async (req, res) => {
  //const foodall = await foodRepository.search().return.all()
  const params = req.params;
  //const name = await foodoptionRepository.search().where('option').matches('egg').return.all()
  /*const query = "@name:{pancake}"
  const albums = await foodRepository.searchRaw(query).return.all();*/
  const name = await foodoptionRepository.search().where('option').contain('*' + params.id + '*').return.all()
  res.send(name)
})

router.get('/search/fooddescRepository/:id', async (req, res) => {
  //const foodall = await foodRepository.search().return.all()
  const params = req.params;
  const name = await foodRepository.search().where('description').matches(params.id).return.all()
  /*const query = "@name:{pancake}"
  const albums = await foodRepository.searchRaw(query).return.all();*/
  res.send(name)
})

router.get('/search/foodvideoRepository/:id', async (req, res) => {
  //const foodall = await foodRepository.search().return.all()
  const params = req.params;
  const name = await foodRepository.search().where('original_video_url').matches(params.id).return.all()
  /*const query = "@name:{pancake}"
  const albums = await foodRepository.searchRaw(query).return.all();*/
  res.send(name)
})

router.get('/search/foodimageRepository/:id', async (req, res) => {
  //const foodall = await foodRepository.search().return.all()
  const params = req.params;
  const name = await foodRepository.search().where('thumbnail_url').matches(params.id).return.all()
  /*const query = "@name:{pancake}"
  const albums = await foodRepository.searchRaw(query).return.all();*/
  res.send(name)
})

router.get('/search/foodinstRepository/:id', async (req, res) => {
  //const foodall = await foodRepository.search().return.all()
  const params = req.params;
  //const name = await foodRepository.search().where('instructions').matches('egg').return.all()
  /*const query = "@name:{pancake}"
  const albums = await foodRepository.searchRaw(query).return.all();*/
  const name = await foodRepository.search().where('instructions').contain('*' + params.id + '*').return.all()
  res.send(name)
})

router.get('/option/:id', async (req, res) => {
  /*const person = await foodRepository.fetch(req.params.id)  //Food:01HSQQE5M9X3R5KQWSKD9A9VJC
  res.send(person)
  console.log(req.params.id);*/

  const person = await foodoptionRepository.save(foodoption)
  res.send(person)
  console.log(person);
})

router.post('/postfood', async (req, res) => {
  const person = await foodRepository.save(food1)
  res.send(person)
  console.log(person);
})

export default router;