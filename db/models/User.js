'use strict'

const mongoose = require('mongoose')
const validator = require('validator')
const uuid = require('uuid')

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

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
})

module.exports = mongoose.model('User', userSchema)
