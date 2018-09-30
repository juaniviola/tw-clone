'use strict'

const test = require('ava')
const api = require('../api')
const schema = require('../models')
const userApi = api.User
const userSchema = schema.User
const chalk = require('chalk')

const mongoose = require('mongoose')
const mongoUrl = 'mongodb://127.0.0.1:27017/tw-clone'

test.before(async () => {
  await mongoose.connect(mongoUrl, { useNewUrlParser: true })
})

test.serial('pass', t => t.pass())

let userId = null
test.serial('save user', async t => {
  const user = await userApi.saveUser({
    username: 'foo_user',
    email: 'foo@gmail.com',
    fullName: 'Foo Test',
    password: 'null'
  })

  userId = user._id
  t.deepEqual(user.username, 'foo_user')
  t.deepEqual(user.email, 'foo@gmail.com')
  t.deepEqual(user.fullName, 'Foo Test')
  t.deepEqual(user.followers[0], undefined)
  t.deepEqual(user.following[0], undefined)
})

test.serial('signin', async t => {
  const result = await userApi.comparePassword({ _id: userId, password: 'null' })
  const error = await userApi.comparePassword({ _id: userId, password: 'foobar' })
  const nullUser = await userApi.comparePassword({ _id: `...${userId}...`,  password: 'null'})

  t.deepEqual(result.data.message, 'exit')
  t.deepEqual(error.error.message, 'Login failed')
  t.deepEqual(nullUser.error.message, 'Some error ocurred')
})

test.serial('get user by id', async t => {
  const user = await userApi.getUserById(userId)

  t.deepEqual(user.username, 'foo_user')
  t.deepEqual(user.fullName, 'Foo Test')
  t.deepEqual(user.followers.length, 0)
  t.deepEqual(user.following.length, 0)
})

test.serial('get user by username', async t => {
  const user = await userApi.getUserByUsername('foo_user')

  t.deepEqual(user.username, 'foo_user')
  t.deepEqual(user.fullName, 'Foo Test')
  t.deepEqual(user.following.length, 0)
  t.deepEqual(user.followers.length, 0)
})

test.serial('get users by username', async t => {
  const user = await userApi.getUsersByUsername('foo')

  t.deepEqual(user[0].username, 'foo_user')
  t.deepEqual(user[0].fullName, 'Foo Test')
  t.deepEqual(user[0].followers.length, 0)
  t.deepEqual(user[0].following.length, 0)
})

test.serial('add and delete followers', async t => {
  const users = [
    {
      username: 'juaniviola1',
      email: 'juaniviola1@gmail.com',
      fullName: 'Juanito Viola',
      password: 'cualquiera'
    },
    {
      username: 'violanacho',
      email: 'violanacho@gmail.com',
      fullName: 'Juani Viola',
      password: 'cualquiera'
    }
  ]

  const _signin = [
    { user: { username: 'juaniviola1', password: 'cualquiera' } },
    { user: { username: 'violanacho', password: 'cualquiera' } }
  ]

  for (let i=0; i<users.length; i++) {
    const us = await userApi.saveUser(users[i])
    const secure = await userApi.signin(_signin[i])

    users[i]._id = us._id
    users[i].secure = secure.secure
  }

  await userApi.addFollower({
    follow: {
      userFromId: users[0]._id,
      userFromSecure: users[0].secure,
      userToId: users[1]._id
    }
  })

  const userFrom = await userApi.getUserByUsername('juaniviola1')
  const userTo = await userApi.getUserByUsername('violanacho')

  await userApi.deleteFollower({
    follow: {
      userFromId: users[0]._id,
      userFromSecure: users[0].secure,
      userToId: users[1]._id
    }
  })

  const _userFrom = await userApi.getUserByUsername('juaniviola1')
  const _userTo = await userApi.getUserByUsername('violanacho')

  t.deepEqual(userFrom.following[0].username, 'violanacho')
  t.deepEqual(userFrom.following[0].fullName, 'Juani Viola')

  t.deepEqual(userTo.followers[0].username, 'juaniviola1')
  t.deepEqual(userTo.followers[0].fullName, 'Juanito Viola')

  t.deepEqual(_userFrom.following[0], undefined)
  t.deepEqual(_userTo.followers[0], undefined)
})

test.todo('errors')
