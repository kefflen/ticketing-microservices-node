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

routes.get('/:id', async (req, res) => {
  const ticket = await TicketModel.findById(req.params.id)

  if (!ticket) {
    return res.status(404).send('Not found')
  }

  res.json(ticket)
})

routes.get('/', async (req, res) => {
  const tickets = await TicketModel.find({})

  res.json(tickets)
})

routes.put('/:id', authenticated, async (req, res) => {
  const { title, price } = ticketSchema.parse(req.body)

  const ticket = await TicketModel.findById(req.params.id)

  if (!ticket) {
    return res.status(404).send('Not found')
  }

  ticket.set({ title, price })
  await ticket.save()

  res.json(ticket)
})

export default routes