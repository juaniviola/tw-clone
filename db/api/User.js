'use strict'

const { User } = require('../models')

module.exports = {
  saveUser: (payload) => {
    const user = new User(payload)
    return user.save()
  }
}
