const requests = require('./requests')

module.exports = {
  addTweet (description) {
    const user = this.getUserInfo()

    const payload = {
      id: user.user._id,
      description,
      secure: user.secure
    }

    return requests.addTweet(payload)
  },

  getUserInfo () {
    const token = localStorage.getItem('token')
    if (!token) return

    let j = token.substring(token.indexOf('.')+1, token.lastIndexOf('.'))
    j = JSON.parse(atob(j))

    return j
  }
}
