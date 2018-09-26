'use strict'

const mongoose = require('mongoose')
const { Tweet, User } = require('../models')
const utils = require('../utils')

module.exports = {
  async saveTweet (payload) {
    const hashtags = utils.getHashtag(payload.description)
    const mentions = utils.getMentions(payload.description)

    const tweet = new Tweet({
      user: payload.user,
      description: payload.description,
      hashtags: hashtags ? hashtags : [],
      mentions: mentions ? mentions : []
    })

    try {
      await tweet.save()
    } catch (err) {
      console.log(err)
      return err
    }

    return Tweet
      .findOne({ _id: tweet._id })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
  },

  tweetsByUser (userId) {
    return Tweet
      .find({ user: userId })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } })
  },

  tweetById (id) {
    return Tweet
      .findOne({ _id: id })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } })
  },

  tweetsByHashtag (hashtag) {
    return Tweet
      .find({ hashtags: hashtag })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } })
  },

  async favTweet (tId, fav, user) {
    if (fav) {
      await Tweet.findOneAndUpdate({ _id: tId }, {
        $push: {
          favs: user._id
        }
      }, { multi: true })
    } else {
      await Tweet.findOneAndUpdate({ _id: tId }, {
        $pull: {
          favs: user._id
        }
      }, { multi: true })
    }

    return Tweet
      .findOne({ _id: tId })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } })
  },

  async updateTweet (_id, description) {
    const hashtags = utils.getHashtag(description)
    const mentions = utils.getMentions(description)

    await Tweet.findOneAndUpdate({ _id }, {
      description,
      mentions,
      hashtags
    })

    return Tweet
      .findOne({ _id })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } })
  },

  deleteTweet (_id) {
    return Tweet.findOneAndRemove({ _id })
  },

  async addAnswer (tId, user, description) {
    await Tweet.findOneAndUpdate({ _id: tId }, {
      $push: {
        answers: {
          user: user._id,
          description
        }
      }
    })

    return Tweet
      .findOne({ _id: tId })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } })
  },

  async deleteAnswer (tId, aId) {
    await Tweet.findOneAndUpdate({ _id: tId }, {
      $pull: {
        answers: {
          _id: aId
        }
      }
    })

    return Tweet
      .findOne({ _id: tId })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } })
  },

  async tweetByFollowingUsers (userId) {
    const f = await User.findOne({ _id: userId })
    return Tweet
      .find({ user: { $in: f.following } })
      .sort({ createdAt: -1 })
      .limit(100)
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } })
  }
}
