require('dotenv').config()

const axios = require('axios')
const cheerio = require('cheerio')

exports.get = async() => {
  
  /*
    ### first parameter -> fs ###
      ** Total of words: &fs=4

    ### second parameter -> fs2 ###
      ** type of dictionary: &fs2=0
        0 - Dicionario Completo
        1 - Dicionario para criancas
        2 - Alimentos
        3 - Animais
        4 - Cores
        5 - Corpo humano
        6 - Educacao
        7 - Familia
        8 - Figuras geometricas
        9 - Midias de comunicacao
        10 - Numeros
        11 - Numeros de 0 a 9
        12 - Profissoes
        13 - Transporte
  */

  const url = `${process.env.RANDON_URL}palavras-aleatorias.php?fs=4&fs2=5&Submit=Nova+palavra`
  const search = await axios.get(url)

  const $ = cheerio.load(search.data)
  const foundedWords = $('table tbody tr td > div')

  let foundedWordsArray = []

  for(let i = 0; i < foundedWords.length -1; i++) {
    if(foundedWords[i].children[0].data != undefined) {
      foundedWordsArray.push(foundedWords[i].children[0].data.toString().trim().replace('\n',''))
    }
  }

  return foundedWordsArray
}
