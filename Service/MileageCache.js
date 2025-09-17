import { promisify } from 'util'
import { cache } from '../Provider/RedisCache.js'

class MileageCache {
  constructor() {
    this.vget = promisify(cache.get).bind(cache)
    this.vset = promisify(cache.set).bind(cache)
    this.vdel = promisify(cache.del).bind(cache)
    this.hmset = promisify(cache.hmset).bind(cache)
    this.hmget = promisify(cache.hmget).bind(cache)
    this.hset = promisify(cache.hset).bind(cache)
    this.hget = promisify(cache.hget).bind(cache)
  }

  getMileageCheckKey(carId) {
    return `mileage_calculated:${carId}`
  }

  getMileageInfoKey(carId) {
    return `mileage_info:${carId}`
  }

  async setMileageChecked(carId) {
    const EXPIRE_TIME_SEC = 300
    await this.vset(this.getMileageCheckKey(carId), 'yes', 'EX', EXPIRE_TIME_SEC)
  }

  async removeMileageChecked(carId) {
    await this.vdel(this.getMileageCheckKey(carId))
  }

  async isMileageCheckRequired(carId) {
    return await this.vget(this.getMileageCheckKey(carId)) === null
  }

  async setMileageInfo(carId, {lat, lng, time }) {
    return await this.hmset(this.getMileageInfoKey(carId), 'lat', lat, 'lng', lng, 'time', time)
  }

  async getMileageInfo(carId) {
    let values = await this.hmget(this.getMileageInfoKey(carId), 'lat', 'lng', 'time')
    if (values.some(v => v === null)) return null

    values = values.map(v => +v)
    const [lat, lng, time] = values
    return { lat, lng, time }
  }
}

export default new MileageCache()