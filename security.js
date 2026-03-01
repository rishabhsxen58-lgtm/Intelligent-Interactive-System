const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('mongo-sanitize')

const applySecurity = app => {
  app.disable('x-powered-by')
  app.use(helmet())
  app.use(xss())
  app.use((req, res, next) => { req.body = mongoSanitize(req.body); req.query = mongoSanitize(req.query); next() })
}

module.exports = { applySecurity }
