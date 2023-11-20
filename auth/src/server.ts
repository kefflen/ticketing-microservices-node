import './load-envs'
import 'express-async-errors'
import express, { NextFunction, Request, Response } from "express"
import routes from "./routes"
import  { ZodError } from 'zod'

const app = express()
app.use(express.json())

app.use('/api', routes)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    console.log(err.issues)
    return res.status(400).json(err.issues)
  }
  
  console.log(err)
  return res.status(500).json(err)
})

export default app