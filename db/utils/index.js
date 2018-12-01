'use strict'

module.exports = {
  getHashtag (text) {
    const hashtag = text.match(/#\w+/g)
    if (hashtag) {
      return hashtag.map(x => x.toLowerCase())
    }

    return hashtag
  },

  getMentions (text) {
    const mentions = text.match(/@\w+/g)

    return mentions
  }
}
