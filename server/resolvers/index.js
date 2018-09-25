'use strict'

const db = require('db')
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

    addTweet(_, args) {
      return Tweet.saveTweet({
        user: args.tw.user,
        description: args.tw.description
      })
    },

    editTweet(_, args) {
      return Tweet.updateTweet(args.tw._id, args.tw.description)
    },

    async deleteTweet(_, args) {
      try {
        await Tweet.deleteTweet(args.id)
        return 'success'
      } catch (err) {
        console.log(err)
        return 'error'
      }
    },

    favTweet(_, args) {
      return Tweet.favTweet(args.id, true, args.user)
    },

    delFav(_, args) {
      return Tweet.favTweet(args.id, false, args.user)
    },

    addAnswer(_, args) {
      return Tweet.addAnswer(args.id, args.user, args.description)
    },

    delAnswer(_, args) {
      return Tweet.deleteAnswer(args.id, args.ansId)
    },

    addFollow(_, args) {
      return User.addFollower(args.userFrom, args.userTo)
    },

    delFollow(_, args) {
      return User.deleteFollower(args.userFrom, args.userTo)
    }
  }
}
