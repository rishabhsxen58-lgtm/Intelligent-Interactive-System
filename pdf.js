import jsPDF from 'jspdf'

export function complaintPdf(complaint) {
  const doc = new jsPDF()
  doc.setFontSize(16)
  doc.text('Complaint Report', 20, 20)
  doc.setFontSize(12)
  doc.text(`ID: ${complaint._id}`, 20, 30)
  doc.text(`Title: ${complaint.title}`, 20, 40)
  doc.text(`Status: ${complaint.status}`, 20, 50)
  doc.text(`Created: ${new Date(complaint.createdAt).toLocaleString()}`, 20, 60)
  doc.text(`Description:`, 20, 70)
  doc.text(complaint.description || '', 20, 80, { maxWidth: 170 })
  doc.save(`complaint_${complaint._id}.pdf`)
}
