const express = require('express')
const { param } = require('express-validator')
const auth = require('../middleware/auth')
const roles = require('../middleware/roles')
const { uploadProof, myAssigned, uploadResolutionProof } = require('../controllers/officerController')

const router = express.Router()

router.get('/assigned', auth, roles('officer'), myAssigned)

router.post('/:id/proof', auth, roles('officer'), uploadProof.single('proof'), [
  param('id').isString()
], uploadResolutionProof)

module.exports = router
