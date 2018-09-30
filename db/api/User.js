'use strict'

const { User } = require('../models')
const { hashSync, compareSync } = require('bcryptjs')
const uuid = require('uuid/v4')

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

  async addFollower (payload) {
    const { userFromId, userFromSecure, userToId } = payload.follow

    const user = await User.findOne({ _id: userFromId })
    if (user.secure !== userFromSecure) throw new Error('Unhauthorized')

    await User.findOneAndUpdate({ _id: userFromId }, {
      $push: { following: userToId }
    })

    await User.findOneAndUpdate({ _id: userToId }, {
      $push: { followers: userFromId }
    })

    return User
      .findOne({ _id: userFromId })
      .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } })
  },

  async deleteFollower (payload) {
    const { userFromId, userFromSecure, userToId } = payload.follow

    const user = await User.findOne({ _id: userFromId })
    if (user.secure !== userFromSecure) throw new Error('Unhauthorized')

    await User.findOneAndUpdate({ _id: userFromId }, {
      $pull: { following: userToId }
    })

    await User.findOneAndUpdate({ _id: userToId }, {
      $pull: { followers: userFromId }
    })

    return User
      .findOne({ _id: userFromId })
      .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } })
  },

  setSecure (_id, secure) {
    return User.findOneAndUpdate({ _id }, { secure })
  },

  async signin (payload) {
    let u = null
    let secure = null

    try {
      u = await User.findOne({ username: payload.user.username })

      if (!compareSync(payload.user.password, u.password)) {
        throw new Error('User and password do not match')
      }

      secure = uuid()
      const h = await this.setSecure(u._id, secure)
    } catch (err) {
      return { error: { message: 'User and password do not match' } }
    }

    return {
      user: u,
      secure
    }
  }
}
