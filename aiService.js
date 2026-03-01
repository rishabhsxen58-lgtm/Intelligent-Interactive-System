const axios = require('axios')

const analyzeText = async ({ title, description }) => {
  const url = (process.env.AI_SERVICE_URL || 'http://localhost:8001') + '/analyze'
  const { data } = await axios.post(url, { title, description })
  return data
}

module.exports = { analyzeText }
