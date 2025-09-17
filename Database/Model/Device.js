import mongoose from 'mongoose'
const { Schema } = mongoose

const schema = new Schema(
  {
    com_id: Number,
    car_id: {
      type: String,
      default: null,
    },
    user_id: String,
    created_at: Date,
    updated_at: Date,
  },
  { collection: 'devices' }
)

export default mongoose.model('Device', schema)
