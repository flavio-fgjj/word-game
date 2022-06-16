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

  // for(let j = 0; j < arrayDictionaryType.length; j++) {
  //   randonWords = null
  //   await randonWordsController(arrayDictionaryType[j].toString())
  //   .then(r => {
  //     randonWords = r.data
  //   })
  //   .catch(err => console.error(err))

  //   if (randonWords != null) {
  //     for(let i = 0; i < randonWords.length; i++) {
  //       await wordDataController(randonWords[i])
  //         .then(x => {
  //           if(x.data && x.data.status === 'OK') {
  //             let jsonData = x.data.data
  //             let syn = [], ant = []

  //             console.log(randonWords[i])
  //             console.log(jsonData)
  //             if(jsonData.synonyms.length > 0) {
  //               syn = jsonData.synonyms.slice(0, 5)
  //             }
  
  //             if(jsonData.antonyms.length > 0) {
  //               ant = jsonData.antonyms.slice(0, 5)
  //             }
  
  //             let model = new Model({
  //               dictionary_type: dictionaryType,
  //               word: randonWords[i],
  //               grammatical_class: jsonData.grammatical_class, 
  //               meaning: jsonData.meaning,
  //               synonyms: syn, 
  //               antonyms: ant,
  //               phrase: x.data.phrase, 
  //               date: today
  //             })
  
  //             // saving at mongodb
  //             model
  //               .save()
  //               .then((result) => {
  //               })
  //               .catch((error) => {
  //                 hasError = true
  //                 err = error
  //               })
  //           }
  //         })
  //         .catch(err => console.error(err))
  //     }
  //   }
  // }
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
            if(x.data && x.data.status === 'OK') {
              let jsonData = x.data.data
              let syn = [], ant = []

              console.log(randonWords[i])
              console.log(jsonData)
              if(jsonData.synonyms.length > 0) {
                syn = jsonData.synonyms.slice(0, 5)
              }
  
              if(jsonData.antonyms.length > 0) {
                ant = jsonData.antonyms.slice(0, 5)
              }
  
              let model = new Model({
                dictionary_type: dictionaryType,
                word: randonWords[i],
                grammatical_class: jsonData.grammatical_class, 
                meaning: jsonData.meaning,
                synonyms: syn, 
                antonyms: ant,
                phrase: x.data.phrase, 
                date: today
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
    }
  }
  
  if (!hasError) {
    res.status(201).send({ output: "New word added" })
  } else {
    res.status(500).send({ output: `Error -> ${err}` })
  }
  
})

module.exports = route