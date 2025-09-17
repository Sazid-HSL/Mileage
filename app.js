import dotenv from 'dotenv'
dotenv.config()

import jobs from './Provider/CronJob.js'
import database from './Provider/MongoDB.js'
import server from './Provider/HttpServer.js'
import { handleError } from './Util/Exception.js'

import ApiController from './Controller/ApiController.js'

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
