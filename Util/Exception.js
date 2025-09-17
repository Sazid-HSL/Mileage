class AppError extends Error {
  constructor(statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }
}

const handleError = (err, res) => {
  const { statusCode = 400, message } = err
  res.status(statusCode).json({ message })
}

module.exports = {
  AppError,
  handleError,
}
