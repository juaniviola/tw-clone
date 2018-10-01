'use strict'

const { Tweet, User } = require('../models')
const mongoose = require('mongoose')
const utils = require('../utils')

module.exports = {
  async saveTweet (payload) {
    const { user, secure, description } = payload
    if (!user || !secure || !description) return { error: { message: 'Invalid parameters' } }

    if (!mongoose.Types.ObjectId.isValid(user)) return { error: { message: 'Invalid user id' } }

    const sec = await User.findOne({ _id: user })
    if (!sec.secure || (sec.secure !== secure)) return { error: { message: 'Unhauthorized' } }

    if (description.length > 280) return { error: { message: 'Maximum of characters exceeded' } }
    const hashtags = utils.getHashtag(description)
    const mentions = utils.getMentions(description)

    const tweet = new Tweet({
      user,
      description,
      hashtags: hashtags ? hashtags : [],
      mentions: mentions ? mentions : []
    })

    await tweet.save()

    return Tweet
      .findOne({ _id: tweet._id })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
  },

  tweetsByUser (userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) return { error: { message: 'Invalid user id' } }

    return Tweet
      .find({ user: userId })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } })
  },

  tweetById (id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return { error: { message: 'Invalid id' } }

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

  async favTweet (payload) {
    const { tweetId, fav, userId, userSecure } = payload.fav
    if (!tweetId || !userId || !userSecure || fav === null || fav === undefined) return { error: { message: 'Invalid parameters' } }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(tweetId)) return { error: { message: 'Invalid id' } }

    const sec = await User.findOne({ _id: userId })
    if (!sec.secure || (sec.secure !== userSecure)) return { error: { message: 'Unhauthorized' } }

    if (fav) {
      await Tweet.findOneAndUpdate({ _id: tweetId }, {
        $push: {
          favs: userId
        }
      }, { multi: true })
    } else {
      await Tweet.findOneAndUpdate({ _id: tweetId }, {
        $pull: {
          favs: userId
        }
      }, { multi: true })
    }

    return Tweet
      .findOne({ _id: tweetId })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } })
  },

  async updateTweet (payload) {
    const { _id, description, secure, userId } = payload.tw
    if (!_id || !description || !secure || !userId) return { error: { message: 'Invalid parameters' }}

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(_id)) return { error: { message: 'Invalid id' } }

    const user = await User.findOne({ _id: userId })
    if (user.secure !== secure) return { error: { message: 'Unhauthorized' } }

    const tw = await Tweet.findOne({ _id })
    if (!tw.user || tw.user.toString().trim() !== userId.toString().trim()) return { error: { message: 'Unhauthorized' } }

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

  async deleteTweet (payload) {
    const { tweetId, userId, userSecure } = payload.tw
    if (!tweetId || !userId || !userSecure) return { error: { message: 'Invalid parameters' } }

    if (!mongoose.Types.ObjectId.isValid(tweetId) || !mongoose.Types.ObjectId.isValid(userId)) return { error: { message: 'Invalid id' } }

    const user = await User.findOne({ _id: userId })
    if (user.secure !== userSecure) return { error: { message: 'Unhauthorized' } }

    const tw = await Tweet.findOne({ _id: tweetId })
    if (!tw.user || (tw.user.toString().trim() !== userId.toString().trim())) return { error: { message: 'Unhauthorized' } }

    return Tweet.findOneAndRemove({ _id: tweetId })
  },

  async addAnswer (payload) {
    const { tweetId, userId, userSecure, description } = payload.answer
    if (!tweetId || !userId || !userSecure || !description) return { error: { message: 'Invalid parameters' } }

    if (!mongoose.Types.ObjectId.isValid(tweetId) || !mongoose.Types.ObjectId.isValid(userId)) return { error: { message: 'Invalid id' } }

    const user = await User.findOne({ _id: userId })
    if (user.secure !== userSecure) return { error: { message: 'Unhauthorized' } }

    await Tweet.findOneAndUpdate({ _id: tweetId }, {
      $push: {
        answers: {
          user: userId,
          description
        }
      }
    })

    return Tweet
      .findOne({ _id: tweetId })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } })
  },

  async deleteAnswer (payload) {
    const { tweetId, answerId, userId, userSecure } = payload.answer
    if (!tweetId || !answerId || !userId || !userSecure) return { error: { message: 'Invalid parameters' } }

    if (!mongoose.Types.ObjectId.isValid(tweetId) || !mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(answerId)) return { error: { message: 'Invalid id' } }

    const user = await User.findOne({ _id: userId })
    if (user.secure !== userSecure) return { error: { message: 'Unhauthorized' } }

    const tw = await Tweet
      .findOne({ _id: tweetId })
      .select({ answers: { $elemMatch: { _id: answerId } } })

    if ((tw.answers.length === 0) || !tw) return { error: { message: 'Answer not found' } }
    if (!tw.answers[0].user || (tw.answers[0].user.toString().trim() !== userId.toString().trim())) return { error: { message: 'Unhauthorized' } }

    await Tweet.findOneAndUpdate({ _id: tweetId }, {
      $pull: {
        answers: {
          _id: answerId
        }
      }
    })

    return Tweet
      .findOne({ _id: tweetId })
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } })
  },

  async tweetByFollowingUsers (userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) return { error: { message: 'Invalid id' } }

    const f = await User.findOne({ _id: userId })
    if (!f) return { error: { message: 'User not found' } }

    return Tweet
      .find({ user: { $in: f.following } })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } })
  }
}
