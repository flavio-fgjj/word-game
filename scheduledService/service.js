require('dotenv').config()

const axios = require('axios')

const job = async () => {
  try {
    return await axios.post(`${process.env.ENDPOINT}`)
  } catch (error) {
    console.error(error.config.url)
    return { "status": "NOK", "output": "Web Scraping error!"}
  }
}

module.exports = job