'use strict'

module.exports = `
  # Type definition for Tweet
  scalar Date

  type Tweet {
    _id: objectId!
    user: User!
    description: String!
    createdAt: Date!
    favs: [User!]
    answers: [Answer!]
    hashtags: [String!]
    mentions: [String!]
  }

  type Answer {
    _id: objectId
    user: User
    description: String
    createdAt: Date
  }

  input newTweet {
    # userId
    user: objectId,
    description: String
    secure: String
  }

  input editTweet {
    _id: objectId,
    description: String,
    secure: String,
    userId: objectId
  }

  input favTweet {
    tweetId: objectId,
    userId: objectId,
    userSecure: String
  }

  input addAnswer {
    tweetId: objectId
    userId: objectId
    userSecure: String
    description: String
  }

  input delAnswer {
    tweetId: objectId
    userId: objectId
    answerId: objectId
    userSecure: String
  }

  input deleteTweet {
    tweetId: objectId
    userId: objectId
    userSecure: String
  }
`
