require('dotenv').config()

const express = require('express')
const cors = require('cors')

const mongoose = require('mongoose')

const config = require('./config/config')
const notFound = require('./middleware/mw-notFound')

// routes
const routeIndex = require('./routes/index')


const app = express()

app.use(express.json())
app.use(cors())

mongoose.connect(config.dbPath, {
  useNewUrlParser:true,
  useUnifiedTopology:true
})

app.use('/', routeIndex)
app.use(notFound)

app.listen(process.env.PORT || 3000, () => console.log(`Server is on-line at port: ${process.env.PORT || 3000}`))