'use strict'

const test = require('ava')
const api = require('../api')
const schema = require('../models')
const twApi = api.Tweet
const twSchema = schema.Tweet

const userApi = api.User
const userSchema = schema.User

const mongoose = require('mongoose')
const chalk = require('chalk')
const mongoUrl = 'mongodb://127.0.0.1:27017/tw-clone'

let u = null
test.before(async t => {
  await mongoose.connect(mongoUrl, { useNewUrlParser: true })

  await userApi.saveUser({
    _id: mongoose.Types.ObjectId(),
    username: 'juaniviola',
    email: 'juaniviola@gmail.com',
    fullName: 'juani viola',
    password: 'none'
  })

  await userSchema.collection.dropIndexes()

  await userApi.saveUser({
    username: 'viola',
    email: 'viola@gmail.com',
    fullName: 'viola',
    password: 'ninguna'
  })


  u = await userSchema.findOne({ username: 'juaniviola' })
})

test.after(async () => {
  await twSchema.deleteMany()
  await userSchema.deleteMany()
})

test.afterEach(async () => {
  await twSchema.deleteMany()
})

test.serial('pass', t => t.pass())

test.serial('add tweet', async t => {

  const tw = await twApi.saveTweet({
    user: u.id,
    description: 'Hello guys. #goodDay. How are you @juaniviola ?'
  })

  t.deepEqual(tw.user, u.id)
  t.deepEqual(tw.description, 'Hello guys. #goodDay. How are you @juaniviola ?')
  t.deepEqual(tw.hashtags[0], '#goodDay')
  t.deepEqual(tw.mentions[0], '@juaniviola')
})

test.serial('tweet with desc > 280', async t => {
  const desc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in volupasdasdsssss'
  let tw = null

  try {
    await twApi.saveTweet({
      user: u.id,
      description: desc
    })
  } catch (err) {
    tw = err
  }

  t.deepEqual(tw._message, 'Tweet validation failed')
})

test.serial('tweets by user', async t => {
  const tweet = await twApi.saveTweet({
    user: u.id,
    description: 'testing1'
  })

  const search1 = await twApi.tweetsByUser(u.id)

  t.deepEqual(search1.length, 1)
  t.deepEqual(search1[0].description, 'testing1')
})

test.serial('fav tweet', async t => {
  const tw = await twApi.saveTweet({
    user: u.id,
    description: '#Hello #guys'
  })

  const user = await userSchema.findOne({ username: 'viola' })
  await twApi.favTweet(tw.id, true, user)
  const tweet = await twSchema.findOne({ id: tw.id })

  await twApi.favTweet(tw.id, false, user)
  const tweet2 = await twSchema.findOne({ id: tw.id })

  t.deepEqual(tweet.favs[0].username, 'viola')
  t.deepEqual(tweet2.favs[0], undefined)
})

test.serial('edit tweet', async t => {
  const tweet = await twApi.saveTweet({
    user: u.id,
    description: 'Hola como va'
  })

  const up = await twApi.updateTweet(tweet.id, 'Hola #brother')
  const tw = await twSchema.findOne({ id: tweet.id })

  t.deepEqual(tw.description, 'Hola #brother')
  t.deepEqual(tw.hashtags[0], '#brother')
})

test.serial('add answer', async t => {
  const tw = await twApi.saveTweet({
    user: u.id,
    description: 'Hola prueba'
  })

  const user = await userSchema.findOne({ username: 'viola' })
  const ans = await twApi.addAnswer(tw.id, user, 'Prueba')
  const tweet = await twSchema.findOne({ id: tw.id })

  t.deepEqual(tweet.answers[0].username, 'viola')
  t.deepEqual(tweet.answers[0].description, 'Prueba')
})

test.serial('delete answer', async t => {
  const tw = await twApi.saveTweet({
    user: u.id,
    description: 'Hola prueba'
  })

  const user = await userSchema.findOne({ username: 'viola' })
  const addAns = await twApi.addAnswer(tw.id, user, 'Prueba')
  const tweet = await twSchema.findOne({ id: tw.id })
  const delAns = await twApi.deleteAnswer(tweet.id, tweet.answers[0]._id)
  const ansDel = await twSchema.findOne({ id: tw.id })

  t.deepEqual(ansDel.answers[0], undefined)
})

test.serial('delete tweet', async t => {
  const tweet = await twApi.saveTweet({
    user: u.id,
    description: 'Hola como andas'
  })

  const remove = await twApi.deleteTweet(tweet.id)
  const find = await twSchema.findOne({ id: remove.id })

  t.deepEqual(find, null)
})

test.serial('tweets by hashtag', async t => {
  const tweet = await twApi.saveTweet({
    user: u.id,
    description: 'fucking #test'
  })

  const first = await twApi.tweetsByHashtag('#test')
  const second = await twApi.tweetsByHashtag('fucking')

  t.deepEqual(first.length, 1)
  t.deepEqual(first[0].hashtags[0], '#test')
  t.deepEqual(first[0].description, 'fucking #test')
  t.deepEqual(second.length, 0)
})

test.todo('get tweets by following users')
