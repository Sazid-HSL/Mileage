const axios = require('axios')
const BaseNotification = require('../Util/Notification/BaseNotification')

module.exports = class PushNotification {
  /**
   * @param {BaseNotification} notification
   */
  async send(notification) {
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    try {
      await axios.post(
        `${process.env.PUSH_SERVICE_URL}/send`,
        notification.build()
      )
    } catch (error) {}
  }
}
