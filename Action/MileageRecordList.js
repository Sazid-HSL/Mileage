import { add } from 'date-fns'
import Mileage from '../Database/Model/Mileage.js'

export default class MileageRecordList {
  async fetch(filter) {
    const items = await Mileage.find(this.makeQuery(filter)).sort({ when: 1 }).exec()
    return items.map(v => v.transform())
  }

  makeQuery(filter) {
    const query = {}
    if (filter.car_id) {
      query.car_id = filter.car_id
    }
    if (filter.month) {
      const from = new Date(+filter.month)
      const to = add(from, { months: 1 })
      query.when = { $gte: from, $lt: to }
    }
    return query
  }
}