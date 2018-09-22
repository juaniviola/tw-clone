'use strict'

const { makeExecutableSchema } = require('graphql-tools')

const User = require('./user')
const Tweet = require('./tweet')

const resolvers = require('../resolvers')

const rootTypeDef = `
  scalar objectId

  type Query {
    helloWorld: String!
    userById(id: objectId!): User!
    userByUsername(username: String!): [User!]
    tweetsByUsername(username: String!): [Tweet!]!
    tweetsByFollowingUsers(username: String!): [Tweet!]!
    tweetsByHashtags(hashtag: String!): [Tweet!]

    tweet(id: objectId!): Tweet!
  }

  type Mutation {
    addUser(u: newUser!): User!
    addTweet(tw: newTweet!): Tweet!
    editTweet(tw: editTweet!): Tweet!
    deleteTweet(id: objectId!): String!
    favTweet(id: objectId!, user: twUser!): Tweet!
    delFav(id: objectId!, user: twUser!): Tweet!
    addAnswer(id: objectId!, user: twUser!, description: String!): Tweet!
    delAnswer(id: objectId!, ansId: objectId!): Tweet!
    addFollow(userFrom: twUser!, userTo: twUser!): User!
    delFollow(userFrom: twUser!, userTo: twUser!): User!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`

module.exports = makeExecutableSchema({
  typeDefs: [rootTypeDef, User, Tweet],
  resolvers
})
