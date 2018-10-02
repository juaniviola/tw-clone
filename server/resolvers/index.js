'use strict'

const { ApolloError } = require('apollo-server')
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
    async addUser(_, args) {
      let u = null

      try {
        u = await User.saveUser({
          username: args.u.username,
          email: args.u.email,
          fullName: args.u.fullName,
          password: args.u.password
        })
      } catch (err) {
        u = err
        if (u.errmsg && u.errmsg.includes('E11000 duplicate key error collection')) {
          if (u.errmsg.includes('username')) throw new ApolloError('User with username already exists')
          if (u.errmsg.includes('email')) throw new ApolloError('User with email already exists')
        }
      }

      return u
    },

    //Signin method just used for tests
    async signin(_, args) {
      if (process.env.NODE_ENV === 'production') throw new ApolloError('deprecated method')

      const signin = await User.signin(args)

      if (signin.error) throw new ApolloError(signin.error.message)

      return signin
    },

    async login(_, args) {
      const login = await User.signin(args)

      if (login.error) throw new ApolloError(login.error.message)

      const payload = login.user
      payload.secure = login.secure

      const token = jwt.sign(payload, secret)
      return token
    },

    async addTweet(_, args) {
      const tw = await Tweet.saveTweet({
        user: args.tw.user,
        description: args.tw.description,
        secure: args.tw.secure
      })

      if (!tw.error) {
        return tw
      } else {
        throw new ApolloError(tw.error.message)
      }
    },

    async editTweet(_, args) {
      const tw = await Tweet.updateTweet(args)

      if (tw.error) throw new ApolloError(tw.error.message)

      return tw
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

    async favTweet(_, args) {
      args.fav.fav = true
      const tw = await Tweet.favTweet(args)

      if (tw.error) throw new ApolloError(tw.error.message)

      return tw
    },

    async delFav(_, args) {
      args.fav.fav = false
      const tw = await Tweet.favTweet(args)

      if (tw.error) throw new ApolloError(tw.error.message)

      return tw
    },

    async addAnswer(_, args) {
      const ans = await Tweet.addAnswer(args)

      if (ans.error) throw new ApolloError(ans.error.message)

      return ans
    },

    async delAnswer(_, args) {
      const ans = await Tweet.deleteAnswer(args)

      if (ans.error) throw new ApolloError(ans.error.message)

      return ans
    },

    async addFollow(_, args) {
      const follow = await User.addFollower(args)

      if (follow.error) throw new ApolloError(follow.error.message)

      return follow
    },

    async delFollow(_, args) {
      const follow = await User.deleteFollower(args)

      if (follow.error) throw new ApolloError(follow.error.message)

      return follow
    }
  }
}
