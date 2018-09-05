'use strict'

const { Tweet } = require('../models')
const utils = require('../utils')

module.exports = {
  saveTweet (payload) {
    const hashtag = utils.getHashtag(payload.description)

    const tweet = new Tweet({
      username: payload.username,
      description: payload.description,
      hashtag: hashtag ? hashtag : []
    })

    return tweet.save()
  }
}
