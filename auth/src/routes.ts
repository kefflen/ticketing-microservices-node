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
  const result = signupSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json(result.error.errors)
  }

  const { email, password } = result.data
  return res.send({ email, password })
})

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(20).trim()
})
routes.post('/users/signin', (req, res) => {
  const result = signinSchema.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json(result.error.errors)
  }

  const { email, password } = result.data
  return res.send('signin')
})

routes.post('/users/signout', (req, res) => {
  return res.send('signout')
})

export default routes