import * as turf from '@turf/turf'
import { startOfDay, add, sub } from 'date-fns'
import LocationService from '../Service/LocationService.js'

export default class MileageWindow {
  static MIN_REQUIRED_LATLNG_COUNT = 5

  /**
   * @param {Date} fromTime
   * @param {Date} toTime
   */
  constructor(fromTime, toTime) {
    this.fromTime = fromTime
    this.toTime = toTime

    this.lastLocation = null
  }

  latLngFilter(a, ind, arr) {
    if (ind === 0) return true // always include the first element

    const MIN_MILEAGE_DISTANCE_KM = 0.03 // 30 meter
    const UNUSUAL_SPEED_KMPH = 200

    const b = arr[ind - 1]
    const point1 = turf.point([a.lng, a.lat])
    const point2 = turf.point([b.lng, b.lat])
    const distanceInKm = turf.distance(point1, point2)
    if (distanceInKm <= MIN_MILEAGE_DISTANCE_KM) {
      return false
    }

    const speedKMPH = distanceInKm / (Math.abs(a.time - b.time) / (1000 * 3600))
    if (speedKMPH >= UNUSUAL_SPEED_KMPH) {
      return false
    }

    return true
  }

  async getTraveledDistance(deviceId) {
    /**
     * Some users get less mileage
     * That's why we increase the distance by 10%
     */
    const DISTANCE_FACTOR = 1.1

    let locations = await LocationService.history(deviceId, this.fromTime.getTime(), this.toTime.getTime())
    locations = locations.filter(this.latLngFilter)

    if (locations.length < MileageWindow.MIN_REQUIRED_LATLNG_COUNT) {
      return 0
    }

    const len = locations.length
    this.lastLocation = locations[len - 1]

    const points = locations.map(l => [l.lng, l.lat])
    const line = turf.lineString(points)
    return turf.length(line) * 1000 * DISTANCE_FACTOR
  }

  getLastLocation() {
    return this.lastLocation
  }

  getMileageDate() {
    let date = add(this.fromTime, { hours: 6 }) // convert to Asia/Dhaka time
    date = sub(date, { hours: 3 }) // To calculate mileage between 3AM to 3AM
    return startOfDay(date)
  }
}