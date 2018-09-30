'use strict'

const { Tweet, User } = require('../models')
const utils = require('../utils')

module.exports = {
  async saveTweet (payload) {
    const sec = await User.findOne({ _id: payload.user })
    if (!sec.secure || (sec.secure !== payload.secure)) return { error: { message: 'Unhauthorized' } }

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

  async favTweet (payload) {
    const { tweetId, fav, userId, userSecure } = payload.fav

    const sec = await User.findOne({ _id: userId })
    if (!sec.secure || (sec.secure !== userSecure)) throw new Error('Unhauthorized')

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

    const user = await User.findOne({ _id: userId })
    if (user.secure !== secure) throw new Error('Unhauthorized')

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

    const user = await User.findOne({ _id: userId })
    if (user.secure !== userSecure) throw new Error('Unhauthorized')

    return Tweet.findOneAndRemove({ _id: tweetId })
  },

  async addAnswer (payload) {
    const { tweetId, userId, userSecure, description } = payload.answer

    const user = await User.findOne({ _id: userId })
    if (user.secure !== userSecure) throw new Error('Unhauthorized')

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

    const user = await User.findOne({ _id: userId })
    if (user.secure !== userSecure) throw new Error('Unhauthorized')

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
    const f = await User.findOne({ _id: userId })
    return Tweet
      .find({ user: { $in: f.following } })
      .sort({ createdAt: -1 })
      .limit(30)
      .populate({ path: 'user', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'favs', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'answers.user', options: { select: { username: 1, fullName: 1 } } })
  }
}
