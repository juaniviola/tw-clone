'use strict'

const test = require('ava')
const api = require('../api')
const schema = require('../models')
const userApi = api.User
const userSchema = schema.User

const mongoose = require('mongoose')
const mongoUrl = 'mongodb://127.0.0.1:27017/tw-clone'

test.before(async () => {
  await mongoose.connect(mongoUrl, { useNewUrlParser: true })
})

test.after(async () => {
  await userSchema.deleteMany()
})

test.serial('pass', t => t.pass())

test.serial('save user', async t => {
  const user = await userApi.saveUser({
    username: 'violanacho',
    email: 'violanacho@gmail.com',
    fullName: 'Juani Viola',
    password: 'null'
  })

  t.deepEqual(user.username, 'violanacho')
  t.deepEqual(user.email, 'violanacho@gmail.com')
  t.deepEqual(user.fullName, 'Juani Viola')
  t.deepEqual(user.password, 'null')
  t.deepEqual(user.followers[0], undefined)
  t.deepEqual(user.following[0], undefined)
})

test.todo('add followers')
