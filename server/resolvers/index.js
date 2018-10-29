'use strict'

const { ApolloError } = require('apollo-server')
const db = require('db')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const ms = require('ms')

const verifyToken = promisify(jwt.verify)
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
  .catch(err => {
    console.log(err)
  })

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

    tweetsByUsername (rootValue, { username }) {
      return Tweet.tweetsByUser(username)
    },

    async tweetsByFollowingUsers (rootValue, { token }) {
      let id = null

      try {
        const dec = await verifyToken(token, secret)
        id = dec.user._id
      } catch (err) {
        throw new ApolloError(err.message)
      }

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

      const payload = {
        user: {
          _id: login.user._id,
          username: login.user.username,
          fullName: login.user.fullName,
        },
        secure: login.secure
      }

      const token = jwt.sign(payload, secret, { expiresIn: ms('1w') })
      return token
    },

    async addTweet(_, args) {
      const token = args.tw.token
      let tw = null

      try {
        const dec = await verifyToken(token, secret)

        tw = await Tweet.saveTweet({
          user: dec.user._id,
          description: args.tw.description,
          secure: dec.secure
        })
      } catch (err) {
        throw new ApolloError(err.message)
      }


      if (!tw.error) {
        return tw
      } else {
        throw new ApolloError(tw.error.message)
      }
    },

    async editTweet(_, args) {
      const token = args.tw.token
      let tw = null

      try {
        const dec = await verifyToken(token, secret)

        tw = await Tweet.updateTweet({
          tw: {
            _id: args.tw._id,
            description: args.tw.description,
            secure: dec.secure,
            userId: dec.user._id
          }
        })
      } catch (err) {
        throw new ApolloError(err.message)
      }

      if (tw.error) throw new ApolloError(tw.error.message)

      return tw
    },

    async deleteTweet(_, args) {
      const token = args.tw.token

      try {
        const dec = await verifyToken(token, secret)

        await Tweet.deleteTweet({
          tw: {
            tweetId: args.tw.tweetId,
            userId: dec.user._id,
            userSecure: dec.secure
          }
        })
        return 'success'
      } catch (err) {
        throw new ApolloError(err.message)
      }
    },

    async favTweet(_, args) {
      const token = args.fav.token
      let tw = null

      try {
        const dec = await verifyToken(token, secret)

        tw = await Tweet.favTweet({
          fav: {
            fav: true,
            tweetId: args.fav.tweetId,
            userId: dec.user._id,
            userSecure: dec.secure
          }
        })
      } catch (err) {
        throw new ApolloError(err.message)
      }

      if (tw.error) throw new ApolloError(tw.error.message)

      return tw
    },

    async delFav(_, args) {
      const token = args.fav.token
      let tw = null

      try {
        const dec = await verifyToken(token, secret)

        tw = await Tweet.favTweet({
          fav: {
            fav: false,
            tweetId: args.fav.tweetId,
            userId: dec.user._id,
            userSecure: dec.secure
          }
        })
      } catch (err) {
        throw new ApolloError(err.message)
      }

      if (tw.error) throw new ApolloError(tw.error.message)

      return tw
    },

    async addAnswer(_, args) {
      const token = args.answer.token
      let ans = null

      try {
        const dec = await verifyToken(token, secret)

        ans = await Tweet.addAnswer({
          answer: {
            tweetId: args.answer.tweetId,
            description: args.answer.description,
            userId: dec.user._id,
            userSecure: dec.secure
          }
        })
      } catch (err) {
        throw new ApolloError(err.message)
      }


      if (ans.error) throw new ApolloError(ans.error.message)

      return ans
    },

    async delAnswer(_, args) {
      const token = args.answer.token
      let ans = null

      try {
        const dec = await verifyToken(token, secret)

        ans = await Tweet.deleteAnswer({
          answer:{
            tweetId: args.answer.tweetId,
            answerId: args.answer.answerId,
            userId: dec.user._id,
            userSecure: dec.secure
          }
        })
      } catch (err) {
        throw new ApolloError(err.message)
      }

      if (ans.error) throw new ApolloError(ans.error.message)

      return ans
    },

    async addFollow(_, args) {
      const token = args.follow.token
      let follow = null

      try {
        const dec = await verifyToken(token, secret)

        follow = await User.addFollower({
          follow: {
            userFromId: dec.user._id,
            userFromSecure: dec.secure,
            userToId: args.follow.userToId
          }
        })
      } catch (err) {
        throw new ApolloError(err.message)
      }

      if (follow.error) throw new ApolloError(follow.error.message)

      return follow
    },

    async delFollow(_, args) {
      const token = args.follow.token
      let follow = null

      try {
        const dec = await verifyToken(token, secret)

        follow = await User.deleteFollower({
          follow: {
            userFromId: dec.user._id,
            userFromSecure: dec.secure,
            userToId: args.follow.userToId
          }
        })
      } catch (err) {
        throw new ApolloError(err.message)
      }

      if (follow.error) throw new ApolloError(follow.error.message)

      return follow
    }
  }
}
