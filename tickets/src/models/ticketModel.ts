import { Schema, model } from "mongoose";

const ticketSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
    }
  }
})

const TicketModel = model('Ticket', ticketSchema)

export default TicketModel