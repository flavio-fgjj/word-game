require('dotenv').config()

const axios = require('axios')
const cheerio = require('cheerio')

let cleaningWord = require('../utils/CleaningWord')

let synonyms = []
let antonyms = []

exports.get = async(_word) => {
  let word = cleaningWord(_word)

  let url = `${process.env.WORD_URL}pesquisa.php?q=${word}`

  let search = await axios.get(url)

  let $ = cheerio.load(search.data)

  let _meaning = $('.significado span')

  let grammatical_class
  let meaning

  if(_meaning.length <= 0) {
    // trying again
    url = `${process.env.WORD_URL}${word}`
    search = await axios.get(url)

    $ = cheerio.load(search.data)
    _meaning = $('.significado')

    if(_meaning.length <= 0) {
      return { 
        "status": "NOK",
        "message": "Palavra invalida"
      }
    } else {
      let newMeaning
      _meaning.each(function() {
        newMeaning = this.children
      })

      grammatical_class = newMeaning[0].children[0].data
      meaning = newMeaning[1].next.children[0].data
    }
  } else {
    grammatical_class = _meaning[0].children[0].data
    meaning = _meaning[1].children[0].data
  }

  const _phraseFont = $('.fonte')
  const _phrase = $('.frase span')
  const _phraseAuthor = $('.frase span em')

  let phraseFont = _phraseFont[0].children[0].data
  let phrase = _phrase[0].children[0].data
  let phraseAuthor = _phraseAuthor[0].children[0].data
  
  const _syn_ant = $('.sinonimos a')

  getSynonyms(_syn_ant);
  
  return {
    "status": "OK",
    "data": {
      "grammatical_class": grammatical_class,
      "meaning": meaning,
      "synonyms": synonyms,
      "antonyms": antonyms
    },
    "phrase": {
      "font": phraseFont,
      "phrase": phrase,
      "author": phraseAuthor
    }
  }
}

function getSynonyms(syn) {
  let isSynonym = false
  let isAntonym = false
 
  if(syn.length > 0) {
    for(let i = 0; i < syn.length; i++) {
      let res = syn[i].prev.data.toString().trim()
      
      if(isAntonym) {
        antonyms.push(`${syn[i].attribs['href'].toString().trim().replace('/', '').replace('/', '')}`)
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
            antonyms.push(`${syn[i].attribs['href'].toString().trim().replace('/', '').replace('/', '')}`)
          } else {
            synonyms.push(`${syn[i].attribs['href'].toString().trim().replace('/', '').replace('/', '')}`)
          }
      }

    }
  } 
}