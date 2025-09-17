import mongoose from 'mongoose'
const { Schema } = mongoose

const schema = new Schema(
  {
    lat: Number,
    lng: Number,
    speed: Number,
    when: Date,
    device_id: String,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date,
  },
  { collection: 'positions' }
)

export default mongoose.model('Position', schema)
