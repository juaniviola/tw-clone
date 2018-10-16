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
          _id
          createdAt
          description
          mentions
          hashtags
          user {
            _id
            username
            fullName
          }
          favs {
            username
            fullName
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
            _id
            username
          }
          answers {
            description
            user {
              username
            }
          }
          createdAt
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
        userFromId: payload.userFromId,
        userFromSecure: payload.userFromSecure,
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
        userFromId: payload.userFromId,
        userFromSecure: payload.userFromSecure,
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

  twByFollowingUsers (id) {
    const query = `
      query tws ($id: objectId!) {
        tweetsByFollowingUsers(id: $id) {
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
            description
            user {
              _id
              username
              fullName
            }
          }
          createdAt
        }
      }
    `

    const variables = {
      id
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

  favTweet (payload) {
    const query = `
      mutation ft ($fav: favTweet!) {
        favTweet(fav: $fav) {
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
            description
            user {
              _id
              username
              fullName
            }
          }
          createdAt
        }
      }
    `

    const variables = {
      fav: {
        tweetId: payload.tweetId,
        userId: payload.userId,
        userSecure: payload.userSecure
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

  delFav (payload) {
    const query = `
      mutation dft ($fav: favTweet!) {
        delFav(fav: $fav) {
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
            description
            user {
              _id
              username
              fullName
            }
          }
          createdAt
        }
      }
    `

    const variables = {
      fav: {
        tweetId: payload.tweetId,
        userId: payload.userId,
        userSecure: payload.userSecure
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

  deleteTweet (payload) {
    const query = `
      mutation delTw ($tw: deleteTweet!) {
        deleteTweet(tw: $tw)
      }
    `

    const variables = {
      tw: {
        tweetId: payload.tweetId,
        userId: payload.userId,
        userSecure: payload.userSecure
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
