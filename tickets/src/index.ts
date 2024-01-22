import './load-envs'
import 'express-async-errors'
import mongoose from 'mongoose'
import configs from './configs'
import server from './server'
import { kafkaService } from './infra/kafkaService'

const start = async () => {
  const connectToKafka = async () => {
    try {
      await kafkaService.connect()
      console.log('Connected to Kafka')
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  const connectToMongoDB = async () => {
    try {
      await mongoose.connect(configs.mongoURI)
      console.log('Connected to MongoDB')
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  const startServer = async () => {
    const PORT = process.env.PORT || 3000
    server.listen(
      PORT,
      () => console.log('Server running at: https://localhost:' + PORT)
    )
  
  }
  
  try {
    await Promise.all([connectToKafka(), connectToMongoDB()])
    await startServer()
  } catch (err) {
    console.log(err)
    return
  }
}

start()