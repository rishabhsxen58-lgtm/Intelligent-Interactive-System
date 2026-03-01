const express = require('express')
const http = require('http')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const { Server } = require('socket.io')
const helmet = require('helmet')
const rateLimiter = require('./src/middleware/rateLimit')
const xss = require('xss-clean')
const mongoSanitize = require('mongo-sanitize')
const connectDB = require('./src/config/db')
const { applySecurity } = require('./src/middleware/security')
const authRoutes = require('./src/routes/authRoutes')
const complaintRoutes = require('./src/routes/complaintRoutes')
const adminRoutes = require('./src/routes/adminRoutes')
const officerRoutes = require('./src/routes/officerRoutes')
const { errorHandler } = require('./src/middleware/error')
const { scheduleEscalations } = require('./src/services/escalationService')

dotenv.config()
const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: process.env.CORS_ORIGIN, methods: ['GET','POST','PUT','DELETE'] } })

connectDB()

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(xss())
app.use((req, res, next) => { req.body = mongoSanitize(req.body); next() })
app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')))
applySecurity(app)
app.use(rateLimiter)

app.set('io', io)

app.use('/api/auth', authRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/officer', officerRoutes)

app.use(errorHandler)

scheduleEscalations(app)

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {})
