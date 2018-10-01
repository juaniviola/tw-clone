'use strict'

const { User } = require('../models')
const { hashSync, compareSync } = require('bcryptjs')
const mongoose = require('mongoose')
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
    if (!mongoose.Types.ObjectId.isValid(id)) return { error: { message: 'Invalid id' } }

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

    if (!mongoose.Types.ObjectId.isValid(userFromId) || !mongoose.Types.ObjectId.isValid(userToId)) return { error: { message: 'Invalid id' } }

    const user = await User.findOne({ _id: userFromId })
    if (user.secure !== userFromSecure) return { error: { message: 'Invalid id' } }

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

    if (!mongoose.Types.ObjectId.isValid(userFromId) || !mongoose.Types.ObjectId.isValid(userToId)) return { error: { message: 'Invalid id' } }

    const user = await User.findOne({ _id: userFromId })
    if (user.secure !== userFromSecure) return { error: { message: 'Invalid id' } }

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
    const { username, password } = payload.user

    let u = null
    let secure = null

    try {
      u = await User.findOne({ username: username })

      if (!compareSync(password, u.password)) {
        return { error: { message: 'User and password do not match' } }
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
