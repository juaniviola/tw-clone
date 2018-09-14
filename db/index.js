'use strict'

const mongoose = require('mongoose')
const api = require('./api')

module.exports = {
  connect (url, port, db) {
    const mongoUrl = `mongodb://${url}:${port}/${db}`
    return mongoose.connect(mongoUrl, { useNewUrlParser: true })
  },

  api
}
