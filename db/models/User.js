'use strict'

const mongoose = require('mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: (value) => {
      return validator.isEmail(value)
    }
  },

  fullName: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  followers: [{ username: String, fullName: String }],

  following: [{ username: String, fullName: String }]
})

module.exports = mongoose.model('User', userSchema)
