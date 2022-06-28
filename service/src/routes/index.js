const express = require('express')

const randonWordsController = require('../controllers/conrtoller-randonWord')
const wordDataController = require('../controllers/cnotroller-wordData')

const Model = require('../model/index')

const route = express.Router()

route.get('/', (req, res) => {
  let now = new Date()
  now.setDate(now.getDate())
  const startToday = new Date(now.getFullYear(),now.getMonth(),now.getDate(),1,0,0)
  const endToday = new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,0,59,59)
  now.setDate(now.getDate() + 1)

  let query = { $and: [ 
    { extracted_date: {$gte: startToday, $lt: endToday} }
  ]}

  let update = { game_date: now }
  let filter

  Model.find((err, result) => {
    if(err) {
      return result
        .status(500)
        .send({
          output: `Err -> ${err}`
        })
    }

    let nextDay = 0
    if(result.length > 0) {
      result.forEach(async (item, index) => {
        if (nextDay > 7) {
          nextDay = 1
          now.setDate(now.getDate() + 1)
          update = { game_date: now }
        } else {
          nextDay++
        }
        
        filter = { _id: item._id }
        await Model.findOneAndUpdate(filter, update)
      })
    }

    return res.status(200).send({
      output: 'OK',
      //payload: result
    })
  })
})

route.post('/', async (req,res)  => {
  let randonWords = null
  let hasError = false
  let err = ''

  const arrayDictionaryType = {
    'Dicionario Completo': 0, 
    //'Dicionario para criancas': 1, 
    //'Alimentos': 2, 
    //'Animais': 3,
    //'Cores': 4,
    //'Corpo humano': 5,
    //'Educacao': 6,
    //'Familia': 7,
    //'Figuras geometricas': 8,
    //'Midias de comunicacao': 9,
    //'Numeros': 10,
    //'Numeros de 0 a 9': 11,
    //'Profissoes': 12,
    //'Transporte': 13,
  }

  for (let dictionaryType in arrayDictionaryType) {
    await randonWordsController(arrayDictionaryType[dictionaryType].toString())
    .then(async r => {
      randonWords = await r.data
    })
    .catch(err => console.error(err))
    
    if (randonWords != null) {
      for(let i = 0; i < randonWords.length; i++) {
        await getMeaning(randonWords[i], dictionaryType)
      }
    }
  }
  
  if (!hasError) {
    res.status(201).send({ output: "New word added" })
  } else {
    res.status(500).send({ output: `Error -> ${err}` })
  }
  
})

async function getMeaning(word, dictionaryType) {
  // let today = new Date()
  await wordDataController(word)
  .then(async x => {
    let wordData = await x.data

    if(wordData && wordData.status === 'OK') {
      let jsonData = wordData.data
      let syn = [], ant = []

      if(jsonData.synonyms.length > 0) {
        syn = jsonData.synonyms.slice(0, 5)
      }

      if(jsonData.antonyms.length > 0) {
        ant = jsonData.antonyms.slice(0, 5)
      }

      let isValid = word.toString().trim().indexOf(' ') == -1 && (word.toString().trim().length > 2 && word.toString().trim().length < 8) && word.toString().trim().toLowerCase().slice(-1) != 's'

      let model = new Model({
        dictionary_type: dictionaryType,
        word: word,
        grammatical_class: jsonData.grammatical_class, 
        meaning: jsonData.meaning,
        synonyms: syn, 
        antonyms: ant,
        phrase: wordData.phrase, 
        // date: today, 
        isWordValid: isValid
      })

      jsonData = null
      syn = []
      ant = []

      // saving at mongodb
      if (isValid) {
        model
          .save()
          .then((result) => {
          })
          .catch((error) => {
            hasError = true
            err = error
          }) 
      }
    }
  })
  .catch(err => console.error(err))
}

module.exports = route