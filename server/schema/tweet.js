'use strict'

module.exports = `
  # Type definition for Tweet
  type Tweet {
    user: User
    description: String!
    createdAt: DateTime!
    favs: [User]
    answer: [Answer]
  }

  type Answer {
    user: User
    description: String!
    createdAt: DateTime!
  }
`
