const requests = require('./requests')

module.exports = {
  isUserLogged () {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token')
      const dec = JSON.parse(atob(token.substring(token.indexOf('.')+1, token.lastIndexOf('.'))))

      if (dec.user._id && dec.user.username && dec.secure && dec.user.fullName) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  },

  signup (payload) {
    return requests.signup(payload)
  },

  login (payload) {
    return requests.login(payload)
  },

  userProfile (payload) {
    return requests.userProfile(payload)
  },

  addFollow (payload) {
    return requests.addFollow(payload)
  },

  delFollow (payload) {
    return requests.delFollow(payload)
  },

  twByFollowingUsers (id) {
    return requests.twByFollowingUsers(id)
  },

  favTweet (payload) {
    return requests.favTweet(payload)
  },

  delFav (payload) {
    return requests.delFav(payload)
  },

  deleteTweet (payload) {
    return requests.deleteTweet(payload)
  },

  tweetById (id) {
    return requests.tweetById(id)
  },

  addAnswer (payload) {
    return requests.addAnswer(payload)
  },

  delAnswer (payload) {
    return requests.delAnswer(payload)
  },

  editTweet (tw) {
    return requests.editTweet(tw)
  },

  tweetsByHashtag (hashtag) {
    return requests.tweetsByHashtag(hashtag)
  },

  usersByUsername (username) {
    return requests.usersByUsername(username)
  }
}
