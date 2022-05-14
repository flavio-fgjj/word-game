require('dotenv').config()

const axios = require('axios')
const cheerio = require('cheerio')

let cleaningWord = require('../utils/CleaningWord')

exports.get = async(_word) => {
  let word = cleaningWord(_word)

  const url = `${process.env.WORD_URL}pesquisa.php?q=${word}`
  
  const search = await axios.get(url)

  const $ = cheerio.load(search.data)

  const _meaning = $('.significado span')

  const phraseFont = $('.fonte')
  const phrase = $('.frase span')
  const phraseAuthor = $('.frase span em')

  if(_meaning.length <= 0) {
    return { 
      "success": "NOK",
      "message": "Palavra invalida"
    }
  }

  console.log('fonte', phraseFont[0].children[0].data) 
  console.log('frase', phrase[0].children[0].data) 
  console.log('autor', phraseAuthor[0].children[0].data) 

  let grammatical_class = _meaning[0].children[0].data
  let meaning = _meaning[1].children[0].data
  const _syn_ant = $('.sinonimos a')

  let synonyms = []
  let antonyms = []
  let isSynonym = false
  let isAntonym = false

  if(_syn_ant.length > 0) {
    for(let i = 0; i < _syn_ant.length; i++) {
      let res = _syn_ant[i].prev.data.toString().trim()
      
      if(isAntonym) {
        antonyms.push(`${_syn_ant[i].attribs['href'].toString().trim().replace('/', '').replace('/', '')}`)
      }
      
      if(!isSynonym) {
          if(res.toString() != ',' && res.toString().indexOf('é sinônimo de:') != -1) {
              isSynonym = true
          }
      }

      if(isSynonym) {
          if(res.toString() != ',' && res.toString().indexOf('é o contrário de:') != -1) {
            isSynonym = false
            isAntonym = true
            antonyms.push(`${_syn_ant[i].attribs['href'].toString().trim().replace('/', '').replace('/', '')}`)
          } else {
            synonyms.push(`${_syn_ant[i].attribs['href'].toString().trim().replace('/', '').replace('/', '')}`)
          }
      }

    }
  }
  
  return {
    "success": "OK",
    "data": {
      "grammatical_class": grammatical_class,
      "meaning": meaning,
      "synonyms": synonyms,
      "antonyms": antonyms
    }
  }
}