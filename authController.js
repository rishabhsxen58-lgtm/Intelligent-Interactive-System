const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { name, email, password, role } = req.body
  const existing = await User.findOne({ email })
  if (existing) return res.status(409).json({ message: 'Email exists' })
  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hash, role: role || 'citizen' })
  res.status(201).json({ id: user._id })
}

const login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' })
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
}

module.exports = { register, login }
