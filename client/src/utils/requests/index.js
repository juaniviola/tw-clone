'use strict'

const user = require('./user')
const tweet = require('./tweet')

module.exports = {
  // user methods
  addFollow (payload) {
    return user.addFollow(payload)
  },

  userProfile(payload) {
    return user.userProfile(payload)
  },

  delFollow(payload) {
    return user.delFollow(payload)
  },

  login (payload) {
    return user.login(payload)
  },

  logout (token) {
    return user.logout(token)
  },

  signup (payload) {
    return user.signup(payload)
  },

  usersByUsername (username) {
    return user.usersByUsername(username)
  },

  // tweet methods
  addTweet (payload) {
    return tweet.addTweet(payload)
  },

  twByFollowingUsers (token) {
    return tweet.twByFollowingUsers(token)
  },

  favTweet (payload) {
    return tweet.favTweet(payload)
  },

  delFav (payload) {
    return tweet.delFav(payload)
  },

  deleteTweet (payload) {
    return tweet.deleteTweet(payload)
  },

  tweetById (id) {
    return tweet.tweetById(id)
  },

  addAnswer (payload) {
    return tweet.addAnswer(payload)
  },

  delAnswer (payload) {
    return tweet.delAnswer(payload)
  },

  editTweet (tw) {
    return tweet.editTweet(tw)
  },

  tweetsByHashtag (hashtag) {
    return tweet.tweetsByHashtag(hashtag)
  }
}
