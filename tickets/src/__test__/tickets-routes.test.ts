import request from 'supertest'
import mongoose from 'mongoose'
import { Request, Response, NextFunction } from 'express'
import server from '../server'
import configs from '../configs'
import TicketModel from '../models/ticketModel'

const registeredUser = {
  id: 'any_id',
  email: 'any_email',
}
const bearerToken = 'Bearer any_token'

jest.mock('../middlewares/authenticated', () => {

  return {
    authenticated: (req: Request, res: Response, next: NextFunction) => {
      if (!req.headers.authorization) {
        return res.status(401).json({
          message: 'Not authorized'
        })
      }

      req.payload = registeredUser
      next()
    }
  }
})

beforeAll(async () => {
  try {
    await mongoose.connect(configs.mongoURI)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.log(err)
    return
  }
})

describe('Tickets API test suite', () => {
  let ticketAttr: {
    title: string
    price: number
  }


  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase()
    ticketAttr = {
      title: 'any_title',
      price: 10
    }
  })

  describe('POST /api/tickets', () => {
    it('should return 401 if not authenticated', async () => {
      await request(server)
        .post('/api/tickets')
        .send({
          title: 'any_title',
          price: 10
        })
        .expect(401)
    })

    it('should return 400 if title is not provided', async () => {
      await request(server)
        .post('/api/tickets')
        .set('Authorization', bearerToken)
        .send({
          price: 10
        }).expect(400)
    })

    it('should return 400 if price is not provided', async () => {
      await request(server)
        .post('/api/tickets')
        .set('Authorization', bearerToken)
    })

    it('should return 400 if price is not a number', async () => {
      await request(server)
        .post('/api/tickets')
        .set('Authorization', bearerToken)
        .send({
          title: 'any_title',
          price: 'invalid_price'
        }).expect(400)
    })

    it('should return 400 if price is less than 0', async () => {
      await request(server)
        .post('/api/tickets')
        .set('Authorization', bearerToken)
        .send({
          title: 'any_title',
          price: -1
        }).expect(400)
    })

    it('should return 201 if ticket is created successfully', async () => {
      await request(server)
        .post('/api/tickets')
        .set('Authorization', bearerToken)
        .send(ticketAttr)
        .expect(201)
    })

    it('should return the created ticket if ticket is created successfully', async () => {
      const response = await request(server)
        .post('/api/tickets')
        .set('Authorization', bearerToken)
        .send(ticketAttr)
        .expect(201)
      expect(response.body).toEqual({
        ...ticketAttr,
        id: expect.any(String),
        __v: expect.any(Number)
      })
    })
  })

  describe('GET /api/tickets', () => {
    beforeEach(async () => {
      await TicketModel.create(ticketAttr)
      await TicketModel.create({
        title: 'any_title_2',
        price: 20
      })
    })

    it('should return 200 and all tickets created', async () => {
      const response = await request(server)
        .get('/api/tickets')
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(2)
      expect(response.body).toContainEqual({
        ...ticketAttr,
        id: expect.any(String),
        __v: expect.any(Number)
      })
    })
  })

  describe('GET /api/tickets/:id', () => {
    let ticketId: string

    beforeEach(async () => {
      await mongoose.connection.db.dropDatabase()
      const ticket = await TicketModel.create(ticketAttr)
      ticketId = ticket.id
    })

    it('should return 404 if ticket is not found', async () => {
      await request(server)
        .get(`/api/tickets/${new mongoose.Types.ObjectId()}`)
        .expect(404)
    })

    it.todo('should return 400 if ticket id is not valid')

    it('should return 200 and ticket if ticket is found', async () => {
      const response = await request(server)
        .get(`/api/tickets/${ticketId}`)
        .expect(200)
      expect(response.body).toEqual({
        ...ticketAttr,
        id: expect.any(String),
        __v: expect.any(Number)
      })
    })
  })

  describe('PUT /api/tickets/:id', () => {
    let ticketId: string

    beforeEach(async () => {
      await mongoose.connection.db.dropDatabase()
      const ticket = await TicketModel.create(ticketAttr)
      ticketId = ticket.id
    })

    it('should return 401 if user is not authenticated', async () => {
      await request(server)
        .put(`/api/tickets/${ticketId}`)
        .send({
          title: 'any_title',
          price: 20
        })
        .expect(401)
    })

    it('should return 404 if ticket is not found', async () => {
      await request(server)
        .put(`/api/tickets/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', bearerToken)
        .send({
          title: 'any_title',
          price: 20
        })
        .expect(404)
    })

    it('should return 400 if title is not provided', async () => {
      await request(server)
        .put(`/api/tickets/${ticketId}`)
        .set('Authorization', bearerToken)
        .send({
          price: 20
        })
        .expect(400)
    })

    it('should return 400 if price is not provided', async () => {
      await request(server)
        .put(`/api/tickets/${ticketId}`)
        .set('Authorization', bearerToken)
        .send({
          title: 'any_title'
        })
        .expect(400)
    })

    it('should return 400 if price is not a number', async () => {
      await request(server)
        .put(`/api/tickets/${ticketId}`)
        .set('Authorization', bearerToken)
        .send({
          title: 'any_title',
          price: 'invalid_price'
        })
        .expect(400)
    })

    it('should return 400 if price is less than 0', async () => {
      await request(server)
        .put(`/api/tickets/${ticketId}`)
        .set('Authorization', bearerToken)
        .send({
          title: 'any_title',
          price: -1
        })
        .expect(400)
    })

    it('should return the updated ticket if ticket is updated successfully', async () => {
      const response = await request(server)
        .put(`/api/tickets/${ticketId}`)
        .set('Authorization', bearerToken)
        .send({
          title: 'any_title',
          price: 20
        })
        .expect(200)
      expect(response.body).toEqual({
        title: 'any_title',
        price: 20,
        id: expect.any(String),
        __v: expect.any(Number)
      })
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})