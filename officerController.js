const { validationResult } = require('express-validator')
const multer = require('multer')
const path = require('path')
const Complaint = require('../models/Complaint')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.random().toString(36).slice(2) + path.extname(file.originalname))
})
const uploadProof = multer({ storage })

const myAssigned = async (req, res) => {
  const items = await Complaint.find({ assignedOfficer: req.user._id }).sort({ createdAt: -1 })
  res.json(items)
}

const uploadResolutionProof = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const c = await Complaint.findById(req.params.id)
  if (!c) return res.status(404).json({ message: 'Not found' })
  if (!c.assignedOfficer || c.assignedOfficer.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' })
  const f = req.file
  c.resolutionProof = { filename: f.filename, path: f.path }
  await c.save()
  req.app.get('io').emit('complaint:update', { type: 'proof', id: c._id })
  res.json({ ok: true })
}

module.exports = { uploadProof, myAssigned, uploadResolutionProof }
