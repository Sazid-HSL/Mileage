import * as turf from '@turf/turf'
import MongoDB from '../Provider/MongoDB.js'

import Car from '../Database/Model/Car.js'
import Device from '../Database/Model/Device.js'
import Position from '../Database/Model/Position.js'
import Mileage from '../Database/Model/Mileage.js'
import { add } from 'date-fns'

describe('Concox device mileage', () => {
  beforeAll(() => {
    return new Promise((resolve, reject) => {
      MongoDB.connect(() => {
        console.log(`connected to DB`)
        resolve()
      })
    })
  })

  it('should calculate day long mileage', async () => {
    const car = await Car.findOne({ reg_no: '11-5873' }).exec()
    const device = await Device.findOne({ car_id: car.id }).exec()

    // console.log('device id: ', device.com_id)

    const startTime = new Date(2021, 5, 27, 0, 0, 0, 0)
    // console.log(startTime)

    const threeAM = add(startTime, { hours: 3 })

    const mileage = await Mileage.findOne({ car_id: car.id, when: startTime }).exec()
    const positions = await Position.find({ device_id: device.id, when: { $gte: threeAM, $lt: add(threeAM, { days: 1 }) } }).exec()

    let points = positions.map(p => [p.lng, p.lat])
    // points = points.filter((p, i, arr) => {
    //   if (i == 0) return true
    //   const pa = turf.point(arr[i - 1])
    //   const pb = turf.point(p)
    //   const diff = 0.03 // 30 meters
    //   return turf.distance(pa, pb) >= diff
    // })

    const line = turf.lineString(points)
    const distance = turf.length(line)

    // console.log('position count: ', positions.length)
    // console.log(`mileage of ${car.reg_no} on ${startTime} -> `, mileage.value / 1000)
    // console.log('turf length', distance)

    expect(mileage.value / 1000).toBeLessThan(distance)
  })

  afterAll(() => {
    return new Promise((resolve, reject) => {
      MongoDB.disconnect(() => {
        console.log('mongodb disconnected')
        resolve()
      })
    })
  })
})