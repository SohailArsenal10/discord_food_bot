import { Router } from 'express'
import { foodoptionRepository, foodRepository } from '../db/foodschema.js'


const router = Router();


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

router.post('/postfood', async (req, res) => {
  //console.log("\n\n cache update req is \n", req.body)
  const person = await foodRepository.save(req.body.Food)
  res.send(person)
  console.log(person);
})

router.post('/postoptionfood', async (req, res) => {
  //console.log("\n\n cache update req is \n", req.body)
  const person = await foodoptionRepository.save(req.body.FoodOptions)
  res.send(person)
  console.log(person);
})

/*
router.get('/search/fooddescRepository/:id', async (req, res) => {
  //const foodall = await foodRepository.search().return.all()
  const params = req.params;
  const name = await foodRepository.search().where('description').matches(params.id).return.all()
  //const query = "@name:{pancake}"
  //const albums = await foodRepository.searchRaw(query).return.all();
  res.send(name)
})

router.get('/search/foodvideoRepository/:id', async (req, res) => {
  //const foodall = await foodRepository.search().return.all()
  const params = req.params;
  const name = await foodRepository.search().where('original_video_url').matches(params.id).return.all()
  //const query = "@name:{pancake}"
  //const albums = await foodRepository.searchRaw(query).return.all();
  res.send(name)
})

router.get('/search/foodimageRepository/:id', async (req, res) => {
  //const foodall = await foodRepository.search().return.all()
  const params = req.params;
  const name = await foodRepository.search().where('thumbnail_url').matches(params.id).return.all()
  //const query = "@name:{pancake}"
  //const albums = await foodRepository.searchRaw(query).return.all();
  res.send(name)
})

router.get('/search/foodinstRepository/:id', async (req, res) => {
  //const foodall = await foodRepository.search().return.all()
  const params = req.params;
  //const name = await foodRepository.search().where('instructions').matches('egg').return.all()
  //const query = "@name:{pancake}"
  //const albums = await foodRepository.searchRaw(query).return.all();
  const name = await foodRepository.search().where('instructions').contain('*' + params.id + '*').return.all()
  res.send(name)
})
*/

export default router;