'use strict'

const db = require('db')
const jwt = require('jsonwebtoken')
const secret = process.env.SECRET || 'test'
let Tweet = null
let User = null
const url = {
  url: process.env.DB_URL || '127.0.0.1',
  port: process.env.DB_PORT || '27017',
  db: process.env.DB_NAME || 'tw-clone'
}

db.connect({ url: url.url, port: url.port, db: url.db })
  .then(api => {
    console.log('connected')
    Tweet = api.Tweet
    User = api.User
  })
  .catch(err => console.log(err))

module.exports = {
  Query: {
    helloWorld () {
      return 'Hello world'
    },

    userById (rootValue, { id }) {
      return User.getUserById(id)
    },

    userByUsername (rootValue, { username }) {
      return User.getUserByUsername(username)
    },

    usersByUsername (rootValue, { username }) {
      return User.getUsersByUsername(username)
    },

    tweetById (rootValue, { id }) {
      return Tweet.tweetById(id)
    },

    tweetsByUsername (rootValue, { id }) {
      return Tweet.tweetsByUser(id)
    },

    tweetsByFollowingUsers (rootValue, { id }) {
      return Tweet.tweetByFollowingUsers(id)
    },

    tweetsByHashtags (rootValue, { hashtag }) {
      return Tweet.tweetsByHashtag(hashtag)
    }
  },

  Mutation: {
    addUser(_, args) {
      return User.saveUser({
        username: args.u.username,
        email: args.u.email,
        fullName: args.u.fullName,
        password: args.u.password
      })
    },

    signin(_, args) {
      return User.signin(args)
    },

    addTweet(_, args) {
      return Tweet.saveTweet({
        user: args.tw.user,
        description: args.tw.description,
        secure: args.tw.secure
      })
    },

    editTweet(_, args) {
      return Tweet.updateTweet(args)
    },

    async deleteTweet(_, args) {
      try {
        await Tweet.deleteTweet(args)
        return 'success'
      } catch (err) {
        console.log(err)
        return 'error'
      }
    },

    favTweet(_, args) {
      args.fav.fav = true
      return Tweet.favTweet(args)
    },

    delFav(_, args) {
      args.fav.fav = false
      return Tweet.favTweet(args)
    },

    addAnswer(_, args) {
      return Tweet.addAnswer(args)
    },

    delAnswer(_, args) {
      return Tweet.deleteAnswer(args)
    },

    addFollow(_, args) {
      return User.addFollower(args)
    },

    delFollow(_, args) {
      return User.deleteFollower(args)
    }
  }
}
