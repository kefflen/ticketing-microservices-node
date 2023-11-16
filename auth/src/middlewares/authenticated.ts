import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export function authenticated(req: Request, res: Response, next: NextFunction) {
  const [bearer, token] = req.headers.authorization?.split(' ') || []
  if (!bearer || !token) {
    return res.status(401).send('Unauthorized')
  }

  if (bearer !== 'Bearer') {
    return res.status(401).send('Unauthorized')
  }

  if (!process.env.SECRET_KEY) {
    throw new Error('SECRET_KEY must be defined')
  }

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY)
    req.payload = payload as { id: string, email: string }
  } catch (err) {
    return res.status(401).send('Unauthorized')
  }

  return next()
}