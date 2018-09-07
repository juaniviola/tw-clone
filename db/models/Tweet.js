'use strict'

const mongoose = require('mongoose')
const { Schema } = mongoose
const uuid = require('uuid')
const userSchema = require('./User')

const tweetSchema = new Schema({
  user: {
    type: String,
    refs: 'User'
  },

  id: {
    type: String,
    default: uuid.v1()
  },

  description: {
    type: String,
    required: true,
    validate: (value) => {
      return value.length <= 280
    }
  },

  createdAt: {
    type: Date,
    default: Date.now()
  },

  favs: [{
    id: {
      type: String,
      required: true
    },

    username: {
      type: String,
      required: true
    }
  }],

  hashtags: {
    type: Array,
    default: []
  },

  mentions: {
    type: Array,
    default: []
  },

  answers: [{
    id: {
      type: String,
      required: true
    },

    username: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    }
  }]
})

module.exports = mongoose.model('Tweet', tweetSchema)
