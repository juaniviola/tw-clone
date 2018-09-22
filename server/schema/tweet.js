'use strict'

module.exports = `
  # Type definition for Tweet
  scalar Date

  type Tweet {
    _id: objectId!
    user: User
    description: String!
    createdAt: Date!
    favs: [User!]
    answers: [Answer!]
    hashtags: [String!]
    mentions: [String!]
  }

  type Answer {
    _id: objectId!
    user: User!
    description: String!
    createdAt: Date!
  }

  input newTweet {
    # userId
    user: objectId!,
    description: String!
  }

  input editTweet {
    _id: objectId!,
    description: String!
  }
`
