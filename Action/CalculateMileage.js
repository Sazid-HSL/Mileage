import MileageRepository from '../Database/Repository/MileageRepository.js'
import MileageCache from '../Service/MileageCache.js'
import MileageWindow from '../Util/MileageWindow.js'

export default class CalculateMileage {
  withData(data) {
    this.carId = data.car_id
    this.deviceId = data.device_id
    this.location = data.location // {lat, lng, time}
    return this
  }

  async execute() {
    try {
      if (await MileageCache.isMileageCheckRequired(this.carId) === false) {
        throw new Error('Mileage calculation time gap is not over yet')
      }

      await MileageCache.setMileageChecked(this.carId)

      const lastMileageSnapshot = await MileageCache.getMileageInfo(this.carId)
      if (lastMileageSnapshot != null) {
        const fromTime = new Date(+lastMileageSnapshot.time)
        const toTime = new Date(+this.location.time)

        const window = new MileageWindow(fromTime, toTime)
        let distance = await window.getTraveledDistance(this.deviceId)
        distance = this.applyDisgustingHack(this.carId, distance)

        if (distance > 0) {
          const date = window.getMileageDate()
          await MileageRepository.updateMileageRecord(this.carId, this.deviceId, date, distance)

          const lastLocation = window.getLastLocation()
          await MileageCache.setMileageInfo(this.carId, lastLocation)

          console.log(new Date(), 'mileage updated:', this.carId, distance, 'meter')
        }
      } else {
        await MileageCache.setMileageInfo(this.carId, this.location)
        console.log(new Date(), 'first time location cache:', this.carId)
      }

      return { status: 'ok' }

    } catch (error) {
      // console.log(new Date(), 'skipping mileage calculation:', this.carId, error.message)
      return { status: 'skip' }
    }
  }

  /**
   * I was forced to perform these dirty disgusting hacks 
   * at the request of Customer care agents. They receives complains
   * from customers about mileage issue and this kind of adjustment needed to be done :X
   * 
   * Forgive me for the sins !
   * 
   * @param {*} carId 
   * @param {*} distance 
   * @returns hacked distance
   */
  applyDisgustingHack(carId, distance) {
    if (carId === '60edab43f25f5b6ab7ef1caf') {
      // This guy always gets 20% extra mileage
      return distance * 0.8
    }
    return distance
  }
}