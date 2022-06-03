const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  dictionary_type: { type: String, required: true },
  word: { type: String, required: true },
  grammatical_class: { type: String }, 
  meaning: { type: String },
  synonyms: [String], 
  antonyms: [String],
  phrase: {
    font: { type: String }, 
    phrase: { type: String },
    author: { type: String }
  },
  date: {type: Date, defaul: Date.now() }
})

module.exports = mongoose.model('Words', schema)