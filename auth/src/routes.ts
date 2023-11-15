import { Router } from 'express'
import z from 'zod'

const routes = Router()

routes.get('/users/currentuser', (req, res) => {
  return res.send('currentuser')
})

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(20).trim()
})
routes.post('/users/signup', (req, res) => {
  const { email, password } = signupSchema.parse(req.body)

  return res.send({ email, password })
})

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(20).trim()
})
routes.post('/users/signin', (req, res) => {
  const { email, password } = signinSchema.parse(req.body)

  return res.status(201).send('signin')
})

routes.post('/users/signout', (req, res) => {
  return res.status(204).send()
})

export default routes