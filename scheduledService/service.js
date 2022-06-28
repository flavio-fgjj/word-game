require('dotenv').config()

const axios = require('axios')

const job = async () => {
  try {
    return await axios.post(`${process.env.ENDPOINT}`)
  } catch (error) {
    console.error(error.config.url)
    return { "status": "NOK", "output": "Error to save words from service!"}
  }
}

const saveForNextDay = async () => {
  try {
    return await axios.get(`${process.env.ENDPOINT}`)
  } catch (error) {
    console.error(error.config.url)
    return { "status": "NOK", "output": "Error to save for next day!"}
  }
}

module.exports = { job, saveForNextDay }