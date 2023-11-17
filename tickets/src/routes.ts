import { Router } from "express"
import zod from 'zod'
import { authenticated } from "./middlewares/authenticated"
//Captalize title
const routes = Router()
const ticketSchema = zod.object({
  title: zod.string().trim().min(1).max(100),
  price: zod.number().gt(0)
})

routes.post('/', authenticated, (req, res) => {
  const { title, price } = ticketSchema.parse(req.body)

  res.sendStatus(200)
})

export default routes