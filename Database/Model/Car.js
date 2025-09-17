import mongoose from 'mongoose'
const { Schema } = mongoose

const schema = new Schema({
  reg_no: String,
  user_id: String,
  created_at: Date,
  updated_at: Date,
})

export default mongoose.model('Car', schema)
