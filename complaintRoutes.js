const express = require('express')
const { body, param } = require('express-validator')
const auth = require('../middleware/auth')
const roles = require('../middleware/roles')
const { upload, createComplaint, getMyComplaints, getOne, assignOfficer, updateStatus, listAll } = require('../controllers/complaintController')

const router = express.Router()

router.post('/', auth, roles('citizen'), upload.array('attachments'), [
  body('title').isLength({ min: 3 }),
  body('description').isLength({ min: 10 })
], createComplaint)

router.get('/me', auth, roles('citizen'), getMyComplaints)

router.get('/:id', auth, param('id').isString(), getOne)

router.put('/:id/assign', auth, roles('admin'), [
  body('officerId').isString()
], assignOfficer)

router.put('/:id/status', auth, [
  body('status').isIn(['in_progress','resolved'])
], updateStatus)

router.get('/', auth, roles('admin'), listAll)

module.exports = router
