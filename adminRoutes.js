const express = require('express')
const auth = require('../middleware/auth')
const roles = require('../middleware/roles')
const { analytics } = require('../controllers/adminController')

const router = express.Router()

router.get('/analytics', auth, roles('admin'), analytics)

module.exports = router
