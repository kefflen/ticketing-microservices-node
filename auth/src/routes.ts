import { Request, Response, Router } from 'express'
import jwt from 'jsonwebtoken'
import z from 'zod'
import UserModel from './models/userSchema'
import { Password } from './utils/password'
import { authenticated } from './middlewares/authenticated'

const routes = Router()

routes.get('/users/currentuser', authenticated, (req: Request, res: Response) => {
  if (!req.payload!) {
    throw new Error('Payload must be defined')
  }

  const { id } = req.payload
  const user = UserModel.findById(id)

  return res.json(user)
})

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(20).trim()
})
routes.post('/users/signup', async (req, res) => {
  const { email, password } = signupSchema.parse(req.body)

  const existingUser = await UserModel.findOne({ email })
  if (existingUser) {
    return res.status(400).send('Email in use')
  }
  const hashedPassword = await Password.toHash(password)
  const user = new UserModel({ email, password: hashedPassword })
  await user.save()

  return res.status(201).json(user)
})

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(20).trim()
})
routes.post('/users/signin', async (req, res) => {
  const { email, password } = signinSchema.parse(req.body)

  const user = await UserModel.findOne({ email })

  if (!user) {
    return res.status(400).send('Invalid credentials')
  }

  const passwordsMatch = await Password.compare(user.password, password)
  if (!passwordsMatch) {
    return res.status(400).send('Invalid credentials')
  }

  const userJwt = jwt.sign({
    id: user.id, email
  }, process.env.SECRET_KEY || 'secret')

  return res.status(200).json({
    user, jwtToken: userJwt
  })
})

routes.post('/users/signout', (req, res) => {
  return res.status(204).send()
})

export default routes