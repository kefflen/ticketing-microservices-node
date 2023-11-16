import { Request } from 'express';

declare module 'express' {
  interface Request {
    payload?: {
      id: string
      email: string
    }
  }
}
