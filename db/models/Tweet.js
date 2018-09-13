'use strict'

const mongoose = require('mongoose')
const { Schema } = mongoose
const uuid = require('uuid')

const tweetSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    description: {
      type: String,
      required: true
    }
  }]
})

module.exports = mongoose.model('Tweet', tweetSchema)
