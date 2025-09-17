import { sub, add } from 'date-fns'
import MileageRepository from "../Database/Repository/MileageRepository.js"
import MileageWindow from '../Util/MileageWindow.js'

export default class RecalculateMileage {
  ofDate(date) {
    this.date = date
    this.date.setHours(0, 0, 0, 0)
    return this
  }

  ofCar(carId) {
    this.carId = carId
    return this
  }

  async execute() {
    const records = await MileageRepository.filter(this.date, this.carId)
    console.log('filtered mileage records', records.length)

    const fromTime = sub(this.date, { hours: 3 })
    const toTime = add(fromTime, { hours: 24 })

    console.log('### from time', fromTime)
    console.log('### to time', toTime)
    let unusualMileageCount = 0
    for (const record of records) {
      if (!record.device_id) continue

      const window = new MileageWindow(fromTime, toTime)
      const distance = await window.getTraveledDistance(record.device_id)

      const diffInKm = (distance - record.value) / 1000
      if(diffInKm > 5 && diffInKm < 1000) {
        console.log('traveled distance diff', diffInKm, record.id)
        unusualMileageCount++
      }

      record.value = distance
      await record.save()
    }

    console.log('totalunusual mileage count', unusualMileageCount)
    return unusualMileageCount
  }
}

// myradar-mileage | filtered mileage records 924
// myradar-mileage | ### from time 2021-08-17T21:00:00.000Z
// myradar-mileage | ### to time 2021-08-18T21:00:00.000Z
// myradar-mileage | 2021-08-19T02:26:30.973Z mileage updated: 5f63faca36374b3de61bab85 3503.2290659021774 meter
// myradar-mileage | 2021-08-19T02:26:34.070Z mileage updated: 5f63fac936374b3de61ba860 3266.916864239649 meter
// myradar-mileage | 2021-08-19T02:26:34.651Z mileage updated: 60c348527fcd954babb5081e 5722.249970789923 meter
// myradar-mileage | 2021-08-19T02:26:35.817Z mileage updated: 5f7ed352c5b4e543412f34f8 1057.4362107357351 meter
// myradar-mileage | 2021-08-19T02:26:35.958Z mileage updated: 5fb2344b945a7d2b1f9ed3d3 1201.3125260844301 meter
// myradar-mileage | 2021-08-19T02:26:36.506Z mileage updated: 5f63facb36374b3de61badb7 1430.2444730035547 meter
// myradar-mileage | 2021-08-19T02:26:36.585Z mileage updated: 5f63faca36374b3de61bac66 2718.1845794989204 meter
// myradar-mileage | 2021-08-19T02:26:36.685Z mileage updated: 5f95160ca46903386b5381ec 440.8628372587634 meter
// myradar-mileage | traveled distance diff 5.25265156026835 611c5fd0da03aa001d43047e
// myradar-mileage | traveled distance diff 35.10909239245708 611c60b3cbf1b3001ce70aca
// myradar-mileage | traveled distance diff 37.630298203320066 611c624a5d14b3001c60538a
// myradar-mileage | traveled distance diff 72.88548119111266 611c62c75d14b3001c60538f
// myradar-mileage | 2021-08-19T02:26:39.856Z mileage updated: 5f93e755aaf8364fe99433aa 792.4617323644195 meter
// myradar-mileage | 2021-08-19T02:26:41.429Z mileage updated: 5f63faca36374b3de61bab6c 2332.981638319012 meter
// myradar-mileage | traveled distance diff 74.598276447719 611c6a6f03d76e001ca42fc0
// myradar-mileage | traveled distance diff 87.66591403230588 611c6b6403d76e001ca42fc7
// myradar-mileage | traveled distance diff 8.906425323367365 611c6da603d76e001ca42fd7
// myradar-mileage | traveled distance diff 36.25303563058481 611c6e8d03d76e001ca42fe1
// myradar-mileage | traveled distance diff 39.67318188042892 611c6f3303d76e001ca42fe8
// myradar-mileage | traveled distance diff 5.985249438666026 611c70a003d76e001ca42ffa
// myradar-mileage | traveled distance diff 19.591605711277634 611c74ed03d76e001ca4302b
// myradar-mileage | traveled distance diff 25.537036364945727 611c753903d76e001ca4302e
// myradar-mileage | traveled distance diff 12.922342270702938 611c761703d76e001ca43032
// myradar-mileage | traveled distance diff 50.453911793817035 611c775903d76e001ca4303d
// myradar-mileage | traveled distance diff 10.633403282390093 611c7af003d76e001ca43062
// myradar-mileage | traveled distance diff 39.43343018010116 611c7ced03d76e001ca43076