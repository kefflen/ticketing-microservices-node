import './load-envs'
import 'express-async-errors'
import mongoose from 'mongoose'
import configs from './configs'
import server from './server'

const start = async () => {
  try {
    await mongoose.connect(configs.mongoURI)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.log(err)
    return
  } 
  const PORT = process.env.PORT || 4000
  server.listen(
    PORT,
    () => console.log('Server running at: https://localhost:' + PORT)
  )
}

start()