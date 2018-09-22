'use strict'

const mongoose = require('mongoose')
const api = require('./api')

module.exports = {
  async connect (mongoUrl) {
    const { url, port, db } = mongoUrl
    const urldb = `mongodb://${url}:${port}/${db}`

    await mongoose.connect(urldb, { useNewUrlParser: true })

    return api
  }
}
