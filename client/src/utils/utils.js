const requests = require('./requests')

module.exports = {
  addTweet (description) {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('jwt error')

    const payload = {
      description,
      token
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
