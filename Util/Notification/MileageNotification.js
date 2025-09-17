const BaseNotification = require('./BaseNotification')

module.exports = class PasswordChangeNotification extends BaseNotification {
  getType() {
    return 23
  }

  getBannerUrl() {
    return 'https://myradar.s3.ap-southeast-1.amazonaws.com/notification/banner/mileage.png'
  }
}