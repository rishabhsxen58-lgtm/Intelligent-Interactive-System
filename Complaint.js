const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['submitted','assigned','in_progress','resolved','escalated'], default: 'submitted' },
  assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  attachments: [{ filename: String, path: String }],
  location: { lat: Number, lng: Number },
  ai: {
    category: String,
    sentiment_score: Number,
    priority_score: Number,
    similarity_score: Number,
    severity_level: String,
    keywords: [String]
  },
  duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', default: null },
  resolutionProof: { filename: String, path: String },
  history: [{ status: String, at: Date }]
}, { timestamps: true })

module.exports = mongoose.model('Complaint', complaintSchema)
