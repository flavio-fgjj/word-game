const { gql } = require('apollo-server')

const types = gql `
    type Word {
      id: ID!
      dictionary_type: String
      word: String
      grammatical_class: String
      meaning: String
      synonyms: [String]
      antonyms: [String]
      phrase: Phrase
    }
    type Phrase {
      font: String
      phrase: String
      author: String 
    }
`

module.exports = types