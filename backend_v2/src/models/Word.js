const mongoose = require("mongoose");

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
  date:  Date
});

module.exports = mongoose.model("Word",WordSchema);