require('dotenv').config()

const jobs = require('./Provider/CronJob')
const database = require('./Provider/MongoDB')
const server = require('./Provider/HttpServer')
const { handleError } = require('./Util/Exception')

const ApiController = require('./Controller/ApiController')

server.use('/api', new ApiController().register())
server.use((err, req, res, next) => {
  handleError(err, res)
})

database.connect(() => {
  console.log(`Connected to Database server`)

  jobs.unusual.register()

  server.listen(process.env.HTTP_PORT, () => {
    console.log(`HTTP server is running on port: ${process.env.HTTP_PORT}`)
  })
})
