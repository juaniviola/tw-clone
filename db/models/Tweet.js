'use strict'

const mongoose = require('mongoose')

const tweetSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now()
  },

  fav: [{
    username: {
      type: String,
      required: true
    }
  }],

  hashtag: {
    type: Array,
    default: []
  },

  answer: [{
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
