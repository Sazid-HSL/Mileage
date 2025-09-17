const { sub } = require('date-fns')
const Mileage = require('../Model/Mileage')

module.exports = {
  async findSingleRecord(car_id, date) {
    date = sub(date, { hours: 6 })
    return await Mileage.findOne({ car_id, when: date }).exec()
  },

  async filter(date, car_id) {
    console.log('filtering mileage records', date, car_id)
    date = sub(date, { hours: 6 })
    const query = { when: date }
    if (car_id) {
      query.car_id = car_id
    }
    return await Mileage.find(query).exec()
  },

  async updateMileageRecord(car_id, device_id, date, traveledDistance) {
    const record = await this.findSingleRecord(car_id, date)

    if (!record) {
      return await Mileage.create({
        value: traveledDistance,
        when: sub(date, { hours: 6 }),
        device_id,
        car_id,
        created_at: new Date(),
        updated_at: new Date(),
      })
    }

    // console.log('mileage update inreval', record.car_id, (new Date().getTime() - record.updated_at.getTime()) / 1000)

    record.value = record.value + traveledDistance
    record.updated_at = new Date()
    await record.save()

    return record
  }
}
