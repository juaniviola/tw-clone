'use strict'

const mongoose = require('mongoose')
const api = require('./api')

module.exports = {
  connect (mongoUrl) {
    const { url, port, db } = mongoUrl
    const urldb = `mongodb://${url}:${port}/${db}`
    return mongoose.connect(urldb, { useNewUrlParser: true })
  },

  api
}
