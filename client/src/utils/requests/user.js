'use strict'

const rp = require('request-promise')
const uri = 'http://localhost:5000/graphql'

module.exports = {
  userProfile (payload) {
    const query = `
      query userInfo ($username: String!) {
        userByUsername(username: $username) {
          _id
          username
          fullName
          followers {
            username
          }
          following {
            username
          }
        }

        tweetsByUsername(username: $username) {
          _id
          user {
            _id
            username
            fullName
          }
          description
          hashtags
          mentions
          favs {
            _id
            username
          }
          answers {
            _id
            description
            user {
              username
            }
            createdAt
          }
          createdAt
        }
      }
    `

    const variables = {
      username: payload
    }

    return rp({
      method: 'POST',
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: { query, variables },
      json: true
    })
  },

  addFollow (payload) {
    const query = `
      mutation addF ($follow: userFollow!) {
        addFollow (follow: $follow) {
          username
        }
      }
    `

    const variables = {
      follow: {
        token: payload.token,
        userToId: payload.userToId,
      }
    }

    return rp({
      method: 'POST',
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: { query, variables },
      json: true
    })
  },

  delFollow (payload) {
    const query = `
      mutation delF ($follow: userFollow!) {
        delFollow (follow: $follow) {
          username
        }
      }
    `

    const variables = {
      follow: {
        token: payload.token,
        userToId: payload.userToId,
      }
    }

    return rp({
      method: 'POST',
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: { query, variables },
      json: true
    })
  },

  login (payload) {
    const query = `
      mutation signin ($user: login!) {
        login(user: $user)
      }
    `

    const variables = {
      user: {
        username: payload.username,
        password: payload.password
      }
    }

    return rp({
      method: 'POST',
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: { query, variables },
      json: true
    })
  },

  logout (token) {
    const query = `
      mutation logout ($token: String!) {
        logout(token: $token)
      }
    `

    const variables = {
      token
    }

    return rp({
      method: 'POST',
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: { query, variables },
      json: true
    })
  },

  signup (payload) {
    const query = `
      mutation signup($u: newUser!) {
        addUser(u: $u) {
          _id
          username
        }
      }
    `

    const variables = {
      u: {
        username: payload.username,
        fullName: payload.fullName,
        email: payload.email,
        password: payload.password
      }
    }

    return rp({
      method: 'POST',
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: { query, variables },
      json: true
    })
  },

  usersByUsername (username) {
    const query = `
      query usByUs ($username: String!) {
        usersByUsername (username: $username) {
          _id
          username
          fullName
          following {
            username
          }
          followers {
            username
          }
        }
      }
    `

    const variables = { username }

    return rp({
      method: 'POST',
      uri,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: { query, variables },
      json: true
    })
  }
}
