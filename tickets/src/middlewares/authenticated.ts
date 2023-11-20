import { NextFunction, Request, Response } from 'express'
import axios from 'axios'
import configs from '../configs'
type payload = {
  id: string
  email: string
}

export async function authenticated(req: Request, res: Response, next: NextFunction) {
  const authUrl = configs.authUrl
  const authorizationHeader = req.headers.authorization
  if (!authorizationHeader) {
    return res.status(401).send('Unauthorized')
  }

  try {
    const { data: payload } = await axios.get<payload>(authUrl + '/api/users/currentuser', {
      headers: {
        authorization: authorizationHeader
      }
    })
    req.payload = payload as { id: string, email: string }
  } catch (err: any) {
    if (!!err.response && err.response.status == 401) {
      return res.status(401).send('Unauthorized')
    } else {
      throw err
    }
  }

  return next()
}