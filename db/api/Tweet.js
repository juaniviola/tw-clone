'use strict'

const mongoose = require('mongoose')
const { Tweet, User } = require('../models')
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

  tweetsByUser (userId) {
    return Tweet
      .find({ user: userId })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1, email: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1, email: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1, email: 1 } } })
  },

  tweetsByHashtag (hashtag) {
    return Tweet
      .find({ hashtags: hashtag })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1, email: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1, email: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1, email: 1 } } })
  },

  favTweet (tId, fav, user) {
    if (fav) {
      return Tweet.findOneAndUpdate({ _id: tId }, {
        $push: {
          favs: user._id
        }
      }, { multi: true })
    } else {
      return Tweet.findOneAndUpdate({ _id: tId }, {
        $pull: {
          favs: user._id
        }
      }, { multi: true })
    }
  },

  updateTweet (id, description) {
    const hashtags = utils.getHashtag(description)
    const mentions = utils.getMentions(description)

    return Tweet.findOneAndUpdate({ _id: id }, {
      description,
      mentions,
      hashtags
    })
  },

  deleteTweet (id) {
    return Tweet.findOneAndRemove({ _id: id })
  },

  addAnswer (tId, user, description) {
    return Tweet.findOneAndUpdate({ _id: tId }, {
      $push: {
        answers: {
          user: user._id,
          description
        }
      }
    })
  },

  deleteAnswer (tId, aId) {
    return Tweet.findOneAndUpdate({ _id: tId }, {
      $pull: {
        answers: {
          _id: aId
        }
      }
    })
  },

  async tweetByFollowingUsers (userId) {
    const f = await User.findOne({ _id: userId })
    return Tweet
      .find({ user: { $in: f.following } })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1, email: 1 } } })
  }
}
