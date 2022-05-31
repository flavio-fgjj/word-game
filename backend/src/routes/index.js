const express = require('express')

const randonWordsController = require('../controllers/conrtoller-randonWord')
const wordDataController = require('../controllers/cnotroller-wordData')

const route = express.Router()

route.get('/', async (req,res)  => {
  let randonWords = null;
  await randonWordsController('0')
    .then(r => {
      randonWords = r.data
    })
    .catch(err => console.error(err))

  if (randonWords != null) {
    for(let i = 0; i < randonWords.length; i++) {
      await wordDataController(randonWords[i])
        .then(x => {
          console.log(`word ${i}: ${randonWords[i]}`)
          console.log(x.data)
        })
        .catch(err => console.error(err))
    }
  }

  // Client.find((err,result) => {
  //   if(err) {
  //     return result
  //       .status(500)
  //       .send({
  //         output: `Err -> ${err}`
  //       })
  //   }

  //   return res.status(200).send({
  //     output: 'OK',
  //     payload: result
  //   })
  // })
})

module.exports = route