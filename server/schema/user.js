'use strict'

module.exports = `
  # Type User definition

  type User {
    _id: objectId!
    username: String!
    fullName: String!
    email: String!
    followers: [User!]
    following: [User!]
  }

  input newUser {
    username: String!,
    email: String!,
    fullName: String!,
    password: String!
  }

  input twUser {
    _id: objectId!
  }
`
