import mongoose from 'mongoose'
const { Schema } = mongoose

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

export default mongoose.model('Mileage', schema)
