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

  addTweet (payload) {
    const query = `
      mutation addTw ($tw: newTweet!) {
        addTweet(tw: $tw) {
          description
          user {
            username
          }
        }
      }
    `

    const variables = {
      tw: {
        user: payload.id,
        description: payload.description,
        secure: payload.secure
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

  tweetsProfile (payload) {
    const query = `
      query tweets ($id: objectId!) {
        tweetsByUsername(id: $id) {
          _id
          user {
            username
            fullName
          }
          description
          hashtags
          mentions
          favs {
            username
          }
          answers {
            description
            user {
              username
            }
          }
        }
      }
    `

    const variables = {
      id: payload
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
