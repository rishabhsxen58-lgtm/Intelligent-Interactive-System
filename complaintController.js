const { validationResult } = require('express-validator')
const multer = require('multer')
const path = require('path')
const Complaint = require('../models/Complaint')
const User = require('../models/User')
const { analyzeText } = require('../services/aiService')
const { sendEmail, sendSMS } = require('../services/notificationService')

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + Math.random().toString(36).slice(2) + path.extname(file.originalname))
})
const upload = multer({ storage })

const createComplaint = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { title, description, lat, lng } = req.body
  const attachments = (req.files || []).map(f => ({ filename: f.filename, path: f.path }))
  const ai = await analyzeText({ title, description })
  let duplicateOf = null
  if (ai.similarity_score && ai.similarity_score > 0.9) {
    const existing = await Complaint.findOne({ 'ai.category': ai.category }).sort({ createdAt: -1 })
    if (existing) duplicateOf = existing._id
  }
  const complaint = await Complaint.create({
    title,
    description,
    citizen: req.user._id,
    attachments,
    location: { lat: Number(lat) || undefined, lng: Number(lng) || undefined },
    ai,
    duplicateOf,
    history: [{ status: 'submitted', at: new Date() }]
  })
  req.app.get('io').emit('complaint:update', { type: 'created', id: complaint._id })
  res.status(201).json({ id: complaint._id })
}

const getMyComplaints = async (req, res) => {
  const items = await Complaint.find({ citizen: req.user._id }).sort({ createdAt: -1 })
  res.json(items)
}

const getOne = async (req, res) => {
  const c = await Complaint.findById(req.params.id)
  if (!c) return res.status(404).json({ message: 'Not found' })
  if (req.user.role === 'citizen' && c.citizen.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Forbidden' })
  res.json(c)
}

const assignOfficer = async (req, res) => {
  const { officerId } = req.body
  const officer = await User.findById(officerId)
  if (!officer || officer.role !== 'officer') return res.status(400).json({ message: 'Invalid officer' })
  const c = await Complaint.findByIdAndUpdate(req.params.id, { assignedOfficer: officerId, status: 'assigned', $push: { history: { status: 'assigned', at: new Date() } } }, { new: true })
  if (!c) return res.status(404).json({ message: 'Not found' })
  req.app.get('io').emit('complaint:update', { type: 'assigned', id: c._id })
  await sendEmail(officer.email, 'New complaint assigned', c.title)
  await sendSMS(officer.email, 'Assigned complaint ' + c._id)
  res.json({ ok: true })
}

const updateStatus = async (req, res) => {
  const { status } = req.body
  const allowed = ['in_progress','resolved']
  if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' })
  const c = await Complaint.findById(req.params.id)
  if (!c) return res.status(404).json({ message: 'Not found' })
  if (req.user.role === 'officer' && (!c.assignedOfficer || c.assignedOfficer.toString() !== req.user._id.toString())) return res.status(403).json({ message: 'Forbidden' })
  c.status = status
  c.history.push({ status, at: new Date() })
  await c.save()
  req.app.get('io').emit('complaint:update', { type: 'status', id: c._id })
  res.json({ ok: true })
}

const listAll = async (req, res) => {
  const { status, category } = req.query
  const q = {}
  if (status) q.status = status
  if (category) q['ai.category'] = category
  const items = await Complaint.find(q).sort({ createdAt: -1 })
  res.json(items)
}

module.exports = { upload, createComplaint, getMyComplaints, getOne, assignOfficer, updateStatus, listAll }
