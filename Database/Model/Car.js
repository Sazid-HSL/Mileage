const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  reg_no: String,
  user_id: String,
  created_at: Date,
  updated_at: Date,
})

module.exports = mongoose.model('Car', schema)
