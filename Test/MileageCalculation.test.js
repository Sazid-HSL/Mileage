import { add, sub, startOfDay, isEqual } from 'date-fns'
import { cache } from '../Provider/RedisCache.js'
import MongoDB from '../Provider/MongoDB.js'
import MileageCache from '../Service/MileageCache.js'
import CalculateMileage from '../Action/CalculateMileage.js'
import LocationService from '../Service/LocationService.js'

import Mileage from '../Database/Model/Mileage.js'
import MileageRepository from '../Database/Repository/MileageRepository.js'

describe('Mileage calculation', () => {
  beforeAll(() => {
    return new Promise((resolve, reject) => {
      MongoDB.connect(() => {
        console.log(`connected to DB`)
        resolve()
      })
    })
  })

  const carId = '60d6be1b194bc643b2e26cef'
  const deviceId = '60d6cbcdba0b0e4927cbd81a'

  it('should set mileage check flag in cache', async () => {
    expect(await MileageCache.isMileageCheckRequired(carId)).toBe(true)

    await MileageCache.setMileageChecked(carId)
    expect(await MileageCache.isMileageCheckRequired(carId)).toBe(false)

    await MileageCache.removeMileageChecked(carId)
    expect(await MileageCache.isMileageCheckRequired(carId)).toBe(true)
  })

  it('should skip mileage calculation if cache is not expired', async () => {
    await MileageCache.setMileageChecked(carId)

    const reply = await new CalculateMileage().withData({ carId }).execute()

    expect(reply.status).toBe('skip')

    await MileageCache.removeMileageChecked(carId)
  })

  it('should filter locations based on distance and speed', async () => {
    const from = startOfDay(new Date())
    const to = add(from, { minutes: 10 })
    const locations = await LocationService.history(deviceId, from.getTime(), to.getTime())

    expect(locations.length).toBeGreaterThan(10)

    const action = new CalculateMileage()
    const filteredLocations = locations.filter(action.latLngFilter)

    console.log('filtered locations in 10 minutes', filteredLocations.length)
    expect(filteredLocations.length).toBeGreaterThan(10)

    const distance = action.getTraveledDistance(filteredLocations)
    console.log('distance in 10 minutes', distance)
    expect(distance).toBeGreaterThan(1000)
  })

  it('should calculate start of day', () => {
    const from = sub(new Date(), { hours: 2 })
    const to = add(from, { minutes: 10 })

    const action = new CalculateMileage()

    const start1 = action.getTimestampContainingDate(from.getTime())
    const start2 = action.getTimestampContainingDate(to.getTime())

    console.log('day start', start1, start2)

    expect(isEqual(start1, start2)).toBe(true)
    expect(start1.getTime()).toBe(start2.getTime())
  })

  it('should update mileage value in database', async () => {
    const date = startOfDay(new Date())
    const distance = 1200
    const original = await Mileage.findOne({ car_id: carId, when: date })

    const record = await MileageRepository.updateMileageRecord(carId, date, distance)

    console.log('mileage records', original, record)

    expect(record.when.getTime()).toBe(original.when.getTime())
    expect(record.value - original.value >= distance).toBe(true)
  })

  afterAll(() => {
    return new Promise((resolve, reject) => {
      cache.quit()
      MongoDB.disconnect(() => {
        console.log('mongodb disconnected')
        resolve()
      })
    })
  })
})