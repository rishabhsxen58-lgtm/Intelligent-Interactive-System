const sendEmail = async (to, subject, body) => {
  console.log('EMAIL', to, subject, body)
}

const sendSMS = async (to, body) => {
  console.log('SMS', to, body)
}

module.exports = { sendEmail, sendSMS }
