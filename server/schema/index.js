'use strict'

const { makeExecutableSchema } = require('graphql-tools')

const User = require('./user')
const Tweet = require('./tweet')

const resolvers = require('../resolvers')

const rootTypeDef = `
  type Query {
    test: String
  }

  schema {
    query: Query
}`

module.exports = makeExecutableSchema({
  typeDefs: [rootTypeDef, User, Tweet],
  resolvers
})
