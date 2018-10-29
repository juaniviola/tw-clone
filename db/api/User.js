'use strict'

const { User } = require('../models')
const { hashSync, compareSync } = require('bcryptjs')
const mongoose = require('mongoose')
const uuid = require('uuid/v4')

async function checkSecure (id, secure) {
  try {
    const user = await User.findOne({ _id: id })
    if (!user || !user.secure || user.secure.length === 0) return false

    const conf = user.secure.find((sec) => sec === secure)
    if (conf)
      return true
    else
      return false
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  saveUser (payload) {
    if (!payload.password || !payload.username || !payload.fullName || !payload.email) return { error: { message: 'Invalid parameters' } }

    payload.password = hashSync(payload.password, 8)
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

  getUserByUsername (usname) {
    const username = usname.toString().trim()

    return User
      .findOne({ username })
      .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } })
  },

  getUsersByUsername (usname) {
    const username = usname.toString().trim()

    return User
      .find({ username: new RegExp(username, 'i') })
      .populate({ path: 'following', options: { select: { username: 1, fullName: 1 } } })
      .populate({ path: 'followers', options: { select: { username: 1, fullName: 1 } } })
  },

  async addFollower (payload) {
    const { userFromId, userFromSecure, userToId } = payload.follow
    if (!userFromId || !userFromSecure || !userToId) return { error: { message: 'Invalid parameters' } }

    if (!mongoose.Types.ObjectId.isValid(userFromId) || !mongoose.Types.ObjectId.isValid(userToId)) return { error: { message: 'Invalid id' } }

    const sec = await checkSecure(userFromId, userFromSecure)
    if (!sec) return { error: { message: 'Unhauthorized' } }

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
    if (!userFromId || !userFromSecure || !userToId) return { error: { message: 'Invalid parameters' } }

    if (!mongoose.Types.ObjectId.isValid(userFromId) || !mongoose.Types.ObjectId.isValid(userToId)) return { error: { message: 'Invalid id' } }

    const sec = await checkSecure(userFromId, userFromSecure)
    if (!sec) return { error: { message: 'Unhauthorized' } }

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
    return User.findOneAndUpdate({ _id }, { $push: { secure } })
  },

  async signin (payload) {
    const { username, password } = payload.user
    if (!username || !password) return { error: { message: 'Invalid parameters' } }

    const usname = username.toString().trim()
    const u = await User.findOne({ username: usname })
    if (!u) return { error: { message: 'User not found' } }

    if (!compareSync(password, u.password)) {
      return { error: { message: 'User and password do not match' } }
    }

    const secure = uuid()
    const h = await this.setSecure(u._id, secure)

    return {
      user: u,
      secure
    }
  },

  async logout (payload) {
    const { userId, userSecure } = payload.logout

    const user = User.findOneAndUpdate({ _id: userId }, {
      $pull: { secure: userSecure }
    })

    return 'success'
  }
}
