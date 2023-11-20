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
      console.log('Teste')
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

  })


  describe('POST /api/users/signout', () => {
    it.todo('should logout the user')
  })

  describe('GET /api/users/currentuser', () => {

  })
})