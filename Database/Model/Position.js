const mongoose = require('mongoose')
const Schema = mongoose.Schema

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

module.exports = mongoose.model('Position', schema)
