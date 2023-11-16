import { Schema, model } from "mongoose"

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type:String,
    required: true
  },
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.password
      ret.id = ret._id
      delete ret._id
    }
  }
})

const UserModel = model('User', userSchema)

export default UserModel