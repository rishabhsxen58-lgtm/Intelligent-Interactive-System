const Complaint = require('../models/Complaint')

const analytics = async (req, res) => {
  const total = await Complaint.countDocuments()
  const byStatus = await Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
  const byCategory = await Complaint.aggregate([{ $group: { _id: '$ai.category', count: { $sum: 1 } } }])
  const avgPriority = await Complaint.aggregate([{ $group: { _id: null, avg: { $avg: '$ai.priority_score' } } }])
  res.json({ total, byStatus, byCategory, avgPriority: avgPriority[0]?.avg || 0 })
}

module.exports = { analytics }
