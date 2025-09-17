const redis = require('redis')

const conf = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
}

const cache = redis.createClient(conf)
cache.on('connect', function () {
  console.log(`redis connection made`)
})
cache.on('error', function (err) {
  // console.log(`redis connect error`, err)
})

module.exports = { cache }