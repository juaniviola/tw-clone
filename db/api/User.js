'use strict'

const { User } = require('../models')

module.exports = {
  saveUser (payload) {
    const user = new User(payload)

    return user.save()
  },

  getUserById (id) {
    return User
      .findOne({ _id: id })
      .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } })
  },

  getUserByUsername (username) {
    return User
      .findOne({ username })
      .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } })
  },

  getUsersByUsername (username) {
    return User
      .find({ username: new RegExp(username, 'i') })
      .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } })
  },

  async addFollower (userFrom, userTo) {
    await User.findOneAndUpdate({ _id: userFrom._id }, {
      $push: { following: userTo._id }
    })

    await User.findOneAndUpdate({ _id: userTo._id }, {
      $push: { followers: userFrom._id }
    })

    return User
      .findOne({ _id: userFrom._id })
      .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } })
  },

  async deleteFollower (userFrom, userTo) {
    await User.findOneAndUpdate({ _id: userFrom._id }, {
      $pull: { following: userTo._id }
    })

    await User.findOneAndUpdate({ _id: userTo._id }, {
      $pull: { followers: userFrom._id }
    })

    return User
      .findOne({ _id: userFrom._id })
      .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } })
  }
}
