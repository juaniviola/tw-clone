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

  tweetsProfile (payload) {
    return requests.tweetsProfile(payload)
  }
}
