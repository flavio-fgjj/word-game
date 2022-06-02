const express = require('express')

const randonWordsController = require('../controllers/conrtoller-randonWord')
const wordDataController = require('../controllers/cnotroller-wordData')

const Model = require('../model/index')

const route = express.Router()

route.post('/', async (req,res)  => {
  let randonWords = null
  let today = new Date()
  let hasError = false
  let err = ''

  const arrayDictionaryType = {
    //'Dicionario Completo': 0, 
    'Dicionario para criancas': 1, 
    'Alimentos': 2, 
    //'Animais': 3,
    //'Cores': 4,
    'Corpo humano': 5,
    'Educacao': 6,
    //'Familia': 7,
    'Figuras geometricas': 8,
    'Midias de comunicacao': 9,
    //'Numeros': 10,
    //'Numeros de 0 a 9': 11,
    'Profissoes': 12,
    'Transporte': 13,
  }

  for (let dictionaryType in arrayDictionaryType) {
    await randonWordsController(arrayDictionaryType[dictionaryType].toString())
    .then(r => {
      randonWords = r.data
    })
    .catch(err => console.error(err))

    if (randonWords != null) {
      for(let i = 0; i < randonWords.length; i++) {
        await wordDataController(randonWords[i])
          .then(x => {
            let jsonData = x.data.data
            let model = new Model({
              dictionary_type: dictionaryType,
              word: randonWords[i],
              grammatical_class: jsonData.grammatical_class, 
              meaning: jsonData.meaning,
              synonyms: jsonData.synonyms.slice(0, 5), 
              antonyms: jsonData.antonyms.slice(0, 5),
              phrase: x.data.phrase, 
              date: today
            })

            // saving at mongodb
            model
              .save()
              .then((result) => {
                //res.status(201).send({ output: "New word added", payload: result });
              })
              .catch((error) => {
                hasError = true
                err = error
                //res.status(500).send({ output: `Error -> ${err}` })
              })
          })
          .catch(err => console.error(err))
      }
    }

  }
  
  if (!hasError) {
    res.status(201).send({ output: "New word added" })
  } else {
    res.status(500).send({ output: `Error -> ${err}` })
  }
  
})

module.exports = route