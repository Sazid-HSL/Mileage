const { Router } = require('express')

module.exports = class Controller {
  constructor() {
    this.router = new Router()
  }

  get(path, handler) {
    this.router.get(path, handler)
  }

  post(path, handler) {
    this.router.post(path, handler)
  }
}
