const mongoose = require('mongoose')
const Schema = mongoose.Schema

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

module.exports = mongoose.model('Device', schema)
