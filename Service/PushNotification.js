import axios from 'axios'
import BaseNotification from '../Util/Notification/BaseNotification.js'

export default class PushNotification {
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
