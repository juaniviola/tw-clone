'use strict'

module.exports = {
  getHashtag (text) {
    const hashtag = text.match(/#\w+/g)

    return hashtag
  },

  getMentions (text) {
    const mentions = text.match(/@\w+/g)

    return mentions
  }
}
