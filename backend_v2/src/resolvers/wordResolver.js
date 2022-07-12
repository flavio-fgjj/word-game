const Word = require('../models/Word')

const wordResolver = {
  Query: {
    async words() {
      let result
      let ret = [Word]
      let now = new Date()
      now.setDate(now.getDate())
      const gd = `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getFullYear().toString().padStart(4, '0')}`
      result = await Word.find({ 
        game_date: { gd } 
      })

      if (result) {
        result.forEach(x => {
          if(ret.length <= 7) {
            ret.push(x)
          }
        })
      }

      // if(ret.length <= 7) {
      //   query = { $and: [ 
      //     { "extracted_date": {$gte: startToday, $lt: endToday} }, 
      //     { "dictionary_type": "Dicionario Completo"},
      //     { "grammatical_class": { $exists: true, $ne: null } },
      //     { "word": { $exists: true, $ne: null } },
      //     { "$expr": { "$gte": [ { "$strLenCP": "$phrase.font" }, 1 ] } }
      //   ]}
      //   result = await Word.find(query)

      //   if (result) {
      //     result.forEach(x => {
      //       ret.push(x)
      //     })
      //   }
      // }

      // // Dicionario para criancas (1)
      // query = { $and: [ 
      //   { date: {$gte: startToday, $lt: endToday} }, 
      //   { "dictionary_type": "Dicionario para criancas"},
      //   { "grammatical_class": { $exists: true, $ne: null } },
      //   { "$expr": { "$gte": [ { "$strLenCP": "$phrase.font" }, 1 ] } }
      // ]}
      // result = await Word.find(query)

      // if (result) {
      //   //ret.push(result.sort(() => Math.random() - Math.random()).slice(0, 2))
      //   result.sort(() => Math.random() - Math.random()).slice(0, 1).forEach(x => {
      //     ret.push(x)
      //   })
      // }
      // result = null

      // // Alimentos (2)
      // query = { $and: [ 
      //   { date: {$gte: startToday, $lt: endToday} }, 
      //   { "dictionary_type": "Alimentos"},
      //   { "grammatical_class": { $exists: true, $ne: null } },
      //   { "$expr": { "$gte": [ { "$strLenCP": "$phrase.font" }, 1 ] } }
      // ]}
      // result = await Word.find(query)

      // if (result) {
      //   result.sort(() => Math.random() - Math.random()).slice(0, 2).forEach(x => {
      //     ret.push(x)
      //   })
      // }
      // result = null

      // // Corpo humano (2)
      // query = { $and: [ 
      //   { date: {$gte: startToday, $lt: endToday} }, 
      //   { "dictionary_type": "Corpo humano"},
      //   { "grammatical_class": { $exists: true, $ne: null } },
      //   { "$expr": { "$gte": [ { "$strLenCP": "$phrase.font" }, 1 ] } }
      // ]}
      // result = await Word.find(query)

      // if (result) {
      //   result.sort(() => Math.random() - Math.random()).slice(0, 2).forEach(x => {
      //     ret.push(x)
      //   })
      // }
      // result = null

      // // Educacao (2)
      // query = { $and: [ 
      //   { date: {$gte: startToday, $lt: endToday} }, 
      //   { "dictionary_type": "Educacao"},
      //   { "grammatical_class": { $exists: true, $ne: null } },
      //   { "$expr": { "$gte": [ { "$strLenCP": "$phrase.font" }, 1 ] } }
      // ]}
      // result = await Word.find(query)

      // if (result) {
      //   result.sort(() => Math.random() - Math.random()).slice(0, 2).forEach(x => {
      //     ret.push(x)
      //   })
      // }
      // result = null

      // // Figuras geometricas (2)
      // query = { $and: [ 
      //   { date: {$gte: startToday, $lt: endToday} }, 
      //   { "dictionary_type": "Figuras geometricas"},
      //   { "grammatical_class": { $exists: true, $ne: null } },
      //   { "$expr": { "$gte": [ { "$strLenCP": "$phrase.font" }, 1 ] } }
      // ]}
      // result = await Word.find(query)

      // if (result) {
      //   result.sort(() => Math.random() - Math.random()).slice(0, 2).forEach(x => {
      //     ret.push(x)
      //   })
      // }
      // result = null

      // // Midias de comunicacao (2)
      // query = { $and: [ 
      //   { date: {$gte: startToday, $lt: endToday} }, 
      //   { "dictionary_type": "Midias de comunicacao"},
      //   { "grammatical_class": { $exists: true, $ne: null } },
      //   { "$expr": { "$gte": [ { "$strLenCP": "$phrase.font" }, 1 ] } }
      // ]}
      // result = await Word.find(query)

      // if (result) {
      //   result.sort(() => Math.random() - Math.random()).slice(0, 2).forEach(x => {
      //     ret.push(x)
      //   })
      // }

      // // Profissoes (2)
      // query = { $and: [ 
      //   { date: {$gte: startToday, $lt: endToday} }, 
      //   { "dictionary_type": "Profissoes"},
      //   { "grammatical_class": { $exists: true, $ne: null } },
      //   { "$expr": { "$gte": [ { "$strLenCP": "$phrase.font" }, 1 ] } }
      // ]}
      // result = await Word.find(query)

      // if (result) {
      //   result.sort(() => Math.random() - Math.random()).slice(0, 2).forEach(x => {
      //     ret.push(x)
      //   })
      // }
      // result = null

      // // Transporte (2)
      // query = { $and: [ 
      //   { date: {$gte: startToday, $lt: endToday} }, 
      //   { "dictionary_type": "Transporte"},
      //   { "grammatical_class": { $exists: true, $ne: null } },
      //   { "$expr": { "$gte": [ { "$strLenCP": "$phrase.font" }, 1 ] } }
      // ]}
      // result = await Word.find(query)

      // if (result) {
      //   result.sort(() => Math.random() - Math.random()).slice(0, 2).forEach(x => {
      //     ret.push(x)
      //   })
      // }

      return ret
    },
    async word(_, { id }) {
      return await Word.findById(id)
    },
  },
  Mutation: {
    createWord(_, { word }) {
      const newWord = new Word(word)
      return newWord.save()
    },
    async updateWord(_, { id, word }) {
      return await Word.findByIdAndUpdate(id, word, { new: true })
    },
    async deleteWord(_, { id }) {
      return await Word.findOneAndDelete(id)
    },
  },
}

module.exports = wordResolver