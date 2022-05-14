'use strict'

const repository = require('../repositories/randon-word-repository')

exports.get = async(req, res, next) => {
  try {
    const data = await repository.get()
    res.status(200).send(data)
  } catch (err) {
    console.log(err)
    res.status(500).send({
      message: 'Falha ao buscar palavras aleatórias'
    })
  }
}
