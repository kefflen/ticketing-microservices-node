import './load-envs'
import mongoose from 'mongoose'
import configs from './configs'
import app from './server'

const start = async () => {
  try {
    await mongoose.connect(configs.mongoURI)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.log(err)
    return
  } 
  const PORT = process.env.PORT || 3000
  app.listen(
    PORT,
    () => console.log('Server running at: https://localhost:' + PORT)
  )
}

start()
