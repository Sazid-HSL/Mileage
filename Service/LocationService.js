const axios = require('axios')

class LocationService {
  /**
   * @param {String} device_id
   * @param {Number} from timestamp
   * @param {Number} to timestamp
   */
  async history(device_id, from, to) {
    try {
      const endpoint = process.env.LOCATION_SERVICE_URL + '/api/history'
      const res = await axios.get(endpoint, { params: { device_id, from, to } })
      return res.data
    } catch (error) {
      console.log(error)
      return []
    }
  }
}

module.exports = new LocationService()