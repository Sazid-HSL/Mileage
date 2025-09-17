const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  value: Number,
  car_id: String,
  device_id: String,
  when: Date,
  created_at: Date,
  updated_at: Date,
})

schema.methods.transform = function () {
  return {
    id: this.id,
    value: this.value,
    time: this.when.getTime(),
  }
}

module.exports = mongoose.model('Mileage', schema)
