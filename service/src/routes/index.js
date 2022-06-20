const express = require('express')

const randonWordsController = require('../controllers/conrtoller-randonWord')
const wordDataController = require('../controllers/cnotroller-wordData')

const Model = require('../model/index')

const route = express.Router()

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
  let today = new Date()
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

      let model = new Model({
        dictionary_type: dictionaryType,
        word: word,
        grammatical_class: jsonData.grammatical_class, 
        meaning: jsonData.meaning,
        synonyms: syn, 
        antonyms: ant,
        phrase: wordData.phrase, 
        date: today, 
        isWordValid: false
      })

      jsonData = null
      syn = []
      ant = []

      // saving at mongodb
      model
        .save()
        .then((result) => {
        })
        .catch((error) => {
          hasError = true
          err = error
        }) 
    }
  })
  .catch(err => console.error(err))
}

module.exports = route