const { gql } = require('apollo-server')

const mutation = gql `
    type Mutation {
        createWord(word: WordInput):Word
        updateWord(id:String, word:WordInput):Word
        deleteWord(id:String):Word
    }

    input WordInput {
      dictionary_type: String
      word: String
      grammatical_class: String
      meaning: String
      synonyms: [String]
      antonyms: [String]
      phrase: PhraseInput
    }

    input PhraseInput {
      font: String
      phrase: String
      author: String 
    }
`

module.exports = mutation