'use strict'

module.exports = `
  # Type User definition
  type User {
    id: ID!
    username: String!
    fullname: String!
    followers: [User!]
    following: [User!]
  }
`
