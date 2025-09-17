import Controller from './Controller.js'

import _ from 'lodash'
import { startOfDay } from 'date-fns'
import MileageRepository from '../Database/Repository/MileageRepository.js'
import MileageRecordList from '../Action/MileageRecordList.js'
import CalculateMileage from '../Action/CalculateMileage.js'
import RecalculateMileage from '../Action/RecalculateMileage.js'

export default class ApiController extends Controller {
  async list(req, res, next) {
    try {
      const action = new MileageRecordList()
      res.json(await action.fetch(req.query))
    } catch (error) {
      next(error)
    }
  }

  async singleRecord(req, res, next) {
    try {
      const { car_id, date } = req.query // 'date' is in ISO 8601 format
      const record = await MileageRepository.findSingleRecord(
        car_id,
        new Date(date)
      )
      res.json({ value: _.get(record, 'value', 0) })
    } catch (error) {
      next(error)
    }
  }

  async consume(req, res, next) {
    try {
      const result = await new CalculateMileage()
        .withData(req.body)
        .execute()
      res.json(result)
    } catch (error) {
      console.log(new Date(), req.body, error)
      next(error)
    }
  }

  async recalculate(req, res, next) {
    try {
      // const carId = '5f63faca36374b3de61bab52'
      const { carId = null, day, month, year } = req.body
      // const carId = '6159cb5993a92c0f0f260bad'
      // below dates are used to check server timezone behaviour
      const now = new Date() // "2021-08-18T01:15:51.100Z"
      const date = startOfDay(now) // "2021-08-18T00:00:00.000Z"
      const fixed = new Date(+year, +month - 1, +day) // "2021-11-28T00:00:00.000Z"
      const action = new RecalculateMileage().ofCar(carId).ofDate(fixed)
      action.execute()
      res.json({ now, date, fixed })
    } catch (error) {
      next(error)
    }
  }

  register() {
    this.get('/list', this.list.bind(this))
    this.get('/single-record', this.singleRecord.bind(this))
    this.post('/consume', this.consume.bind(this))
    this.post('/recalculate', this.recalculate.bind(this))

    return this.router
  }
}
