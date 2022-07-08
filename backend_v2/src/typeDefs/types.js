const { gql } = require('apollo-server')

const types = gql `
  scalar Date
  type Word {
    id: ID!
    dictionary_type: String
    word: String
    grammatical_class: String
    meaning: String
    synonyms: [String]
    antonyms: [String]
    phrase: Phrase
    extracted_date: Date
    game_date: Date
    game_seq: Int
    isWordValid: Boolean
  }
  type Phrase {
    font: String
    phrase: String
    author: String 
  }
`

module.exports = types