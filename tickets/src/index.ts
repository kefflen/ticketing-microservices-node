import './load-envs'
import 'express-async-errors'
import express, { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import mongoose from 'mongoose'
import configs from './configs'
import routes from './routes'

const app = express()
app.use(express.json())

app.use('/api', routes)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  if (err instanceof ZodError) {
    return res.status(400).json(err.issues)
  }
  
  return res.status(500).json(err)
})

const start = async () => {
  try {
    await mongoose.connect(configs.mongoURI)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.log(err)
    return
  } 
  const PORT = process.env.PORT || 4000
  app.listen(
    PORT,
    () => console.log('Server running at: https://localhost:' + PORT)
  )
}