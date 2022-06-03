require('dotenv').config()
const mongoose = require('mongoose')
const { ApolloServer } = require('apollo-server')

const typeDefs = require('./typeDefs/index')
const resolvers = require('./resolvers/index')

const urldb = process.env.MONGO_CONNECTION_STRING
mongoose.connect(urldb, { useNewUrlParser: true, useUnifiedTopology: true })

const server = new ApolloServer({ typeDefs, resolvers })

server
  .listen()
  .then(({ url }) => console.log(`Server is online at ${url}`))
  .catch((erro) => console.error(`Error to run the server -> ${erro}`))