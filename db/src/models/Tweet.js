'use strict'

const mongoose = require('mongoose')
const { Schema } = mongoose

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
    default: new Date()
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
    },

    createdAt: {
      type: Date
    }
  }]
})

module.exports = mongoose.model('Tweet', tweetSchema)
