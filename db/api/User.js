'use strict'

const { User } = require('../models')

module.exports = {
  saveUser (payload) {
    const user = new User(payload)

    return user.save()
  },

  getUserByUsername (username) {
    return User
      .find({ username })
      .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } })
  },

  async addFollower (userFrom, userTo) {
    await User.findOneAndUpdate({ _id: userFrom._id }, {
      $push: { following: userTo._id }
    })

    return User.findOneAndUpdate({ _id: userTo._id }, {
      $push: { followers: userFrom._id }
    })
  },

  async deleteFollower (userFrom, userTo) {
    await User.findOneAndUpdate({ _id: userFrom._id }, {
      $pull: { following: userTo._id }
    })

    return User.findOneAndUpdate({ _id: userTo._id }, {
      $pull: { followers: userFrom._id }
    })
  }
}
