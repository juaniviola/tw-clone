'use strict'

const mongoose = require('mongoose')
const { Tweet } = require('../models')
const utils = require('../utils')

module.exports = {
  saveTweet (payload) {
    const hashtags = utils.getHashtag(payload.description)
    const mentions = utils.getMentions(payload.description)

    const tweet = new Tweet({
      user: payload.user,
      description: payload.description,
      hashtags: hashtags ? hashtags : [],
      mentions: mentions ? mentions : []
    })

    return tweet.save()
  },

  tweetsByUser (user) {
    return Tweet.find({ user })
  },

  tweetsByHashtag (hashtag) {
    return Tweet.find({ hashtags: hashtag })
  },

  favTweet (tId, fav, user) {
    if (fav) {
      return Tweet.findOneAndUpdate({ id: tId }, {
        $push: {
          favs: {
            username: user.username,
            id: user.id
          }
        }
      }, { multi: true })
    } else {
      return Tweet.findOneAndUpdate({ id: tId }, {
        $pull: {
          'favs': {
            id: user.id,
            username: user.username
          }
        }
      }, { multi: true })
    }
  },

  updateTweet (id, description) {
    const hashtags = utils.getHashtag(description)
    const mentions = utils.getMentions(description)

    return Tweet.findOneAndUpdate({ id }, {
      description,
      mentions,
      hashtags
    })
  },

  deleteTweet (id) {
    return Tweet.findOneAndRemove({ id })
  },

  addAnswer (tId, user, description) {
    return Tweet.findOneAndUpdate({ id: tId }, {
      $push: {
        answers: {
          id: user.id,
          username: user.username,
          description
        }
      }
    })
  },

  deleteAnswer (tId, aId) {
    return Tweet.findOneAndUpdate({ id: tId }, {
      $pull: {
        answers: {
          _id: aId
        }
      }
    })
  }
}
