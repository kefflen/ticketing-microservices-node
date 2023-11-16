import { Router } from 'express'
import z from 'zod'
import jwt from 'jsonwebtoken'
import UserModel from './models/userSchema'
import { Password } from './utils/password'

const routes = Router()

routes.get('/users/currentuser', (req, res) => {
  return res.send('currentuser')
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