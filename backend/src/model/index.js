const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  word: { type: String, required: true },
  grammatical_class: { type: String }, 
  meaning: { type: String },
  synonyms: [String], 
  antonyms: [String],
  phrase: phrase,
  date: {type: Date, defaul: Date.now() }
})

const phrase = new mongoose.Schema({
  font: { type: String }, 
  phrase: { type: String },
  author: { type: String }
})

module.exports = mongoose.model('Words', schema)