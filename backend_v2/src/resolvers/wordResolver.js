const Word = require('../models/Word')

const wordResolver = {
  Query: {
    async words() {
      const now = new Date()
      const startToday = new Date(now.getFullYear(),now.getMonth(),now.getDate(),1,0,0)
      const endToday = new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,0,59,59)
      const query = { date: {$gte: startToday, $lt: endToday} }
      const ret = await Word.find(query)

      if (ret) {
        return ret.sort(() => Math.random() - Math.random()).slice(0, 10)
      }
      return null
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