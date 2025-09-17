module.exports = class BaseNotification {
  constructor() {
    this.userId = null
    this.payload = {}
  }

  sendTo(userId) {
    this.userId = userId
    return this
  }

  setTitle(title) {
    this.payload.title = title
    return this
  }

  setBody(body) {
    this.payload.body = body
    return this
  }

  getType() {
    return 0
  }

  getBannerUrl() {
    return ''
  }

  build() {
    if (!this.userId) throw new Error('Receiver id not defined')

    this.payload.type = this.getType()
    this.payload.banner_url = this.getBannerUrl()
    return {
      user_id: this.userId,
      payload: this.payload,
    }
  }
}
