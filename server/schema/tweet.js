'use strict'

module.exports = `
  # Type definition for Tweet
  scalar Date

  type Tweet {
    user: User
    description: String!
    createdAt: Date!
    favs: [User!]
    answer: [Answer]
  }

  type Answer {
    user: User
    description: String!
    createdAt: Date!
  }
`
