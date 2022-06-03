const { gql } = require('apollo-server')

const query = gql `
    type Query { 
        words:[Word]
        word(id:ID!):Word
    }
`

module.exports = query
