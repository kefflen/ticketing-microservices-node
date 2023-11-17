import { Router } from "express"
import { authenticated } from "./middlewares/authenticated"

const routes = Router()

routes.post('/', authenticated, (req, res) => {
  res.sendStatus(200)
})

export default routes