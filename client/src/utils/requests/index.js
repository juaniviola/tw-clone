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
            _id
            description
            user {
              username
            }
            createdAt
          }
        }
      }
    `

    const variables = {
      tw: {
        description: payload.description,
        token: payload.token
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

  twByFollowingUsers (token) {
    const query = `
      query tws ($token: String!) {
        tweetsByFollowingUsers(token: $token) {
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
              _id
              username
              fullName
            }
            createdAt
          }
          createdAt
        }
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
            _id
            description
            user {
              _id
              username
              fullName
            }
            createdAt
          }
          createdAt
        }
      }
    `

    const variables = {
      fav: {
        tweetId: payload.tweetId,
        token: payload.token
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
            _id
            description
            user {
              _id
              username
              fullName
            }
            createdAt
          }
          createdAt
        }
      }
    `

    const variables = {
      fav: {
        tweetId: payload.tweetId,
        token: payload.token
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
        token: payload.token
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

  tweetById (id) {
    const query = `
      query twById ($id: objectId!) {
        tweetById(id: $id) {
          _id
          description
          createdAt
          hashtags
          mentions
          favs {
            _id
            username
            fullName
          }
          answers {
            _id
            description
            user {
              _id
              username
              fullName
            }
            createdAt
          }
          user {
            _id
            username
            fullName
          }
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

  addAnswer (payload) {
    const query = `
      mutation addAns ($answer: addAnswer!) {
        addAnswer(answer: $answer) {
          _id
          description
          createdAt
          hashtags
          mentions
          favs {
            _id
            username
            fullName
          }
          answers {
            _id
            description
            user {
              _id
              username
              fullName
            }
            createdAt
          }
          user {
            _id
            username
            fullName
          }
        }
      }
    `

    const variables = {
      answer: {
        tweetId: payload.tweetId,
        token: payload.token,
        description: payload.description
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

  delAnswer (payload) {
    const query = `
      mutation delAns ($answer: delAnswer!) {
        delAnswer(answer: $answer) {
          _id
          description
          createdAt
          hashtags
          mentions
          favs {
            _id
            username
            fullName
          }
          answers {
            _id
            description
            user {
              _id
              username
              fullName
            }
            createdAt
          }
          user {
            _id
            username
            fullName
          }
        }
      }
    `

    const variables = {
      answer: {
        tweetId: payload.tweetId,
        token: payload.token,
        answerId: payload.answerId
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

  editTweet (tw) {
    const query = `
      mutation edTw ($tw: editTweet!) {
        editTweet(tw: $tw) {
          _id
          description
          createdAt
          hashtags
          mentions
          favs {
            _id
            username
            fullName
          }
          answers {
            _id
            description
            user {
              _id
              username
              fullName
            }
            createdAt
          }
          user {
            _id
            username
            fullName
          }
        }
      }
    `

    const variables = {
      tw: {
        _id: tw._id,
        token: tw.token,
        description: tw.description
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

  tweetsByHashtag (hashtag) {
    const query = `
      query edTw ($hashtag: String!) {
        tweetsByHashtags(hashtag: $hashtag) {
          _id
          description
          createdAt
          hashtags
          mentions
          favs {
            _id
            username
            fullName
          }
          answers {
            _id
            description
            user {
              _id
              username
              fullName
            }
            createdAt
          }
          user {
            _id
            username
            fullName
          }
        }
      }
    `

    const variables = { hashtag }

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
