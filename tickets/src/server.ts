import './load-envs'
import 'express-async-errors'
import express, { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import routes from './routes'

const server = express()
server.use(express.json())

server.use('/api/tickets', routes)

server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  if (err instanceof ZodError) {
    return res.status(400).json(err.issues)
  }
  
  return res.status(500).json(err)
})

export default server