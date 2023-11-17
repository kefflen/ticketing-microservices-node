import { Router } from "express"
import zod from 'zod'
import { authenticated } from "./middlewares/authenticated"
import TicketModel from "./models/ticketModel"

const routes = Router()
const ticketSchema = zod.object({
  title: zod.string().trim().min(1).max(100),
  price: zod.number().gt(0)
})

routes.post('/', authenticated, async (req, res) => {
  const { title, price } = ticketSchema.parse(req.body)

  const ticket = new TicketModel({ title, price })
  await ticket.save()

  res.status(201).json(ticket)
})

export default routes