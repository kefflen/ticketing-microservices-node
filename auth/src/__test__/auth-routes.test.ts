import request from 'supertest'
import UserModel from '../models/userSchema'
import app from '../server'
import mongoose from 'mongoose'
import configs from '../configs'

describe('Auth API test suite', () => {
  let userCredentials: {
    email: string
    password: string
  }

  beforeAll(async () => {
    try {
      await mongoose.connect(configs.mongoURI)
      console.log('Connected to MongoDB')
    } catch (err) {
      console.log(err)
      return
    }
  })

  beforeEach(async () => {
    await UserModel.deleteMany({})
    userCredentials = {
      email: 'any@email.com',
      password: 'any_password'
    }
  })
  describe('POST /api/users/signup', () => {
    it('should return 201 on successful signup', async () => {
      await request(app)
        .post('/api/users/signup')
        .send(userCredentials)
        .expect(201)
    })
    
    it('returns a 400 with an invalid email', async () => {
      await request(app)
        .post('/api/users/signup')
        .send({
          ...userCredentials,
          email: 'invalid_email'
        })
        .expect(400)
    })

    it('returns a 400 with password with less than three characters', async () => {
      await request(app)
        .post('/api/users/signup')
        .send({
          ...userCredentials,
          password: '123'
        })
        .expect(400)
    })

    it('returns a 400 with password with more than twenty characters', async () => {
      await request(app)
        .post('/api/users/signup')
        .send({
          ...userCredentials,
          password: '123456789012345678901'
        })
        .expect(400)
    })

    it('returns a 400 with missing email and password', async () => {
      await request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400)
    })

    it('disallows duplicate emails', async () => {
      await request(app)
        .post('/api/users/signup')
        .send(userCredentials)
        .expect(201)
      
      await request(app)
        .post('/api/users/signup')
        .send(userCredentials)
        .expect(400)
    })
  })

  describe('POST /api/users/signin', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/users/signup')
        .send(userCredentials)
        .expect(201)
    })

    it('fails when a email that does not exist is supplied', async () => {
      await request(app)
        .post('/api/users/signin')
        .send({
          ...userCredentials,
          email: 'invalid@email.com'
        })
        .expect(400)
    })

    it('fails when an incorrect password is supplied', async () => {
      await request(app)
        .post('/api/users/signin')
        .send({
          ...userCredentials,
          password: 'incorrect'
        })
        .expect(400)
    })

    it('should return jwtToken on successful signin', async () => {
      const response = await request(app)
        .post('/api/users/signin')
        .send(userCredentials)
        .expect(200)
      
      expect(response.body).toHaveProperty('jwtToken')
    })
  })

  describe('GET /api/users/currentuser', () => {
    let bearerToken: string
  beforeEach(async () => {
      await request(app)
        .post('/api/users/signup')
        .send(userCredentials)
        .expect(201)

      const response = await request(app)
        .post('/api/users/signin')
        .send(userCredentials)
        .expect(200)
  
      bearerToken = `Bearer ${response.body.jwtToken}`
    })

    it('should return 401 if not authenticated', async () => {
      await request(app)
        .get('/api/users/currentuser')
        .expect(401)
    })

    it('should return 200 if authenticated', async () => {
      await request(app)
        .get('/api/users/currentuser')
        .set('Authorization', bearerToken)
        .expect(200)
    })
  })
  describe('POST /api/users/signout', () => {
    it.todo('should logout the user')
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })
})
