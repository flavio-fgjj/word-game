const mongoose = require('mongoose')


const WordSchema = mongoose.Schema({
  dictionary_type: String,
  word: String,
  grammatical_class: String, 
  meaning: String,
  synonyms: [String], 
  antonyms: [String],
  phrase: {
    font: String, 
    phrase: String,
    author: String 
  },
  extracted_date: Date,
  game_date: Date, 
  game_seq: Number, 
  isWordValid: Boolean
})

module.exports = mongoose.model('Word', WordSchema)