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

  await userSchema.deleteMany()
})

test.after(async () => {
  await userSchema.deleteMany()
})

test.serial('pass', t => t.pass())

test.serial('save user', async t => {
  const user = await userApi.saveUser({
    username: 'juaniviola1',
    email: 'jv1@gmail.com',
    fullName: 'Juani Viola',
    password: 'null'
  })

  await userSchema.findOneAndRemove({ _id: user._id })

  t.deepEqual(user.username, 'juaniviola1')
  t.deepEqual(user.email, 'jv1@gmail.com')
  t.deepEqual(user.fullName, 'Juani Viola')
  t.deepEqual(user.password, 'null')
  t.deepEqual(user.followers[0], undefined)
  t.deepEqual(user.following[0], undefined)
})

test.serial('add and delete followers', async t => {
  const u = await userApi.saveUser({
    username: 'juaniviola1',
    email: 'juaniviola1@gmail.com',
    fullName: 'Juanito Viola',
    password: 'cualquiera'
  })

  const user = await userApi.saveUser({
    username: 'violanacho',
    email: 'violanacho@gmail.com',
    fullName: 'Juani Viola',
    password: 'cualquiera'
  })

  // u follow to user. user follower u
  await userApi.addFollower(u, user)

  const userFrom = await userApi.getUserByUsername('juaniviola1')
  const userTo = await userApi.getUserByUsername('violanacho')

  await userApi.deleteFollower(u, user)

  const _userFrom = await userApi.getUserByUsername('juaniviola1')
  const _userTo = await userApi.getUserByUsername('violanacho')

  t.deepEqual(userFrom[0].following[0].username, 'violanacho')
  t.deepEqual(userFrom[0].following[0].fullName, 'Juani Viola')
  t.notDeepEqual(userFrom[0].following[0].password, 'cualquiera')

  t.deepEqual(userTo[0].followers[0].username, 'juaniviola1')
  t.deepEqual(userTo[0].followers[0].fullName, 'Juanito Viola')
  t.notDeepEqual(userTo[0].followers[0].email, 'juaniviola1@gmail.com')

  t.deepEqual(_userFrom[0].following[0], undefined)
  t.deepEqual(_userTo[0].followers[0], undefined)
})
