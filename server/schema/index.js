'use strict'

const { makeExecutableSchema } = require('graphql-tools')

const User = require('./user')
const Tweet = require('./tweet')

const rootTypeDef = `
  type Query {
    user: User
    tweet: Tweet
  }

  schema {
    query: Query
}`

module.exports = makeExecutableSchema({
  typeDefs: [rootTypeDef, User, Tweet]
})
