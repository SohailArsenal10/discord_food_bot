import { Router } from 'express'
import { foodRepository } from '../db/foodschema.js'


const router = Router();

router.get('/:id', async (req, res) => {
  const person = await foodRepository.fetch(req.params.id)
  res.send(person)
})

router.get('/', async (req, res) => {
  res.json({
    code:200
  })
})

export default router;