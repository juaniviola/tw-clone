'use strict'

const { User } = require('../models')
const { hashSync, compareSync } = require('bcryptjs')

module.exports = {
  saveUser (payload) {
    if (payload.password) {
      payload.password = hashSync(payload.password, 8)
    }
    const user = new User(payload)

    return user.save()
  },

  async comparePassword (user) {
    let u = null

    try {
      u = await User.findOne({ _id: user._id })
    } catch (err) {
      return { error: { message: 'Some error ocurred' } }
    }

    if (!compareSync(user.password, u.password)) {
      return { error: { message: 'Login failed' } }
    } else {
      return { data: { message: 'exit' } }
    }
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
  },

  setSecure (_id, secure) {
    return User.findOneAndUpdate({ _id }, { secure })
  }
}
