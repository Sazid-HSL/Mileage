import { CronJob } from 'cron'
import { startOfYesterday, sub } from 'date-fns'
import dateFnsTz from 'date-fns-tz'
const { zonedTimeToUtc } = dateFnsTz

import Mileage from '../Database/Model/Mileage.js'
import Car from '../Database/Model/Car.js'
import PushNotification from '../Service/PushNotification.js'
import MileageNotification from '../Util/Notification/MileageNotification.js'

export default class UnusualMileageNotifier {
  constructor() {
    this.notificationService = new PushNotification()
  }

  async invoke() {
    try {
      const records = await this.getYesterdayMileages()
      const avarage = await this.getAvarageMileage(15)

      const cars = await this.getUnusualMileageCars(records, avarage)
      for (const car of cars) {
        const notification = new MileageNotification()
          .setTitle(`Alert for car - ${car.reg_no}`)
          .setBody(`Your car was driven ${car.mileage} km yesterday !!`)
          .sendTo(car.user_id)

        this.notificationService.send(notification)
      }
    } catch (error) { }
  }

  async getUnusualMileageCars(records, avarage) {
    const unusualCarIds = []
    for (const record of records) {
      const index = avarage.findIndex(item => item._id === record.car_id)
      if (index !== -1) {
        const avgRecord = avarage[index]
        if (record.value > avgRecord.mileage * 2) {
          unusualCarIds.push(record.car_id)
        }
      }
    }

    console.log(`unusual mileage count: `, unusualCarIds.length, new Date())

    const cars = await Car.find(
      { _id: { $in: unusualCarIds } },
      { user_id: 1, reg_no: 1 }
    ).exec()

    return cars.map(car => {
      const record = records.find(v => v.car_id === car.id)
      car.mileage = Math.floor(record.value / 1000)
      return car
    })
  }

  async getYesterdayMileages() {
    const date = zonedTimeToUtc(startOfYesterday(), process.env.TIME_ZONE)
    return await Mileage.find({
      $and: [{ when: date }, { value: { $gt: 1000 } }],
    }).exec()
  }

  async getAvarageMileage(days) {
    const date = zonedTimeToUtc(startOfYesterday(), process.env.TIME_ZONE)
    const startDate = sub(date, { days })
    const endDate = sub(date, { days: 1 })
    return await Mileage.aggregate([
      {
        $match: {
          $and: [{ when: { $gte: startDate } }, { when: { $lte: endDate } }],
        },
      },
      {
        $group: {
          _id: '$car_id',
          mileage: { $avg: '$value' },
          count: { $sum: 1 },
        },
      },
    ]).exec()
  }

  register() {
    this.job = new CronJob(
      '0 0 10 * * *',
      this.invoke.bind(this),
      null,
      false,
      'Asia/Dhaka'
    )
    this.job.start()
  }
}
