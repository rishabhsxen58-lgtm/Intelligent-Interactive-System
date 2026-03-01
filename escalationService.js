const Complaint = require('../models/Complaint')
const User = require('../models/User')
const { sendEmail } = require('./notificationService')

const scheduleEscalations = app => {
  const run = async () => {
    const threshold = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const items = await Complaint.find({ status: { $in: ['submitted','assigned','in_progress'] }, createdAt: { $lt: threshold } })
    for (const c of items) {
      c.status = 'escalated'
      c.history.push({ status: 'escalated', at: new Date() })
      await c.save()
      app.get('io').emit('complaint:update', { type: 'escalated', id: c._id })
      const citizen = await User.findById(c.citizen)
      if (citizen) await sendEmail(citizen.email, 'Complaint escalated', c.title)
    }
  }
  setInterval(run, 24 * 60 * 60 * 1000)
}

module.exports = { scheduleEscalations }
