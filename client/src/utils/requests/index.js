const rp = require('request-promise')
const uri = 'http://localhost:5000/graphql'

module.exports = {
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

  signup (payload) {
    const query = `
      mutation signup($u: newUser!) {
        addUser(u: $u) {
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
  }
}
