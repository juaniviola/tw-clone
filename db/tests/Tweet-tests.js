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

test.before(async t => {
  await mongoose.connect(mongoUrl, { useNewUrlParser: true })

  await twSchema.deleteMany()
  await userSchema.deleteMany()

  await userApi.saveUser({
    username: 'juaniviola',
    email: 'juaniviola@gmail.com',
    fullName: 'juani viola',
    password: 'none'
  })


  await userApi.saveUser({
    username: 'viola',
    email: 'viola@gmail.com',
    fullName: 'viola',
    password: 'ninguna'
  })
})

test.beforeEach(async () => {
  await twSchema.deleteMany()
})

test.serial('pass', t => t.pass())

test.serial('add tweet', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })

  console.log(chalk.red(u._id))
  const tw = await twApi.saveTweet({
    user: u._id,
    description: 'Hello guys. #goodDay. How are you @juaniviola ?'
  })

  t.deepEqual(tw.user, u._id)
  t.deepEqual(tw.description, 'Hello guys. #goodDay. How are you @juaniviola ?')
  t.deepEqual(tw.hashtags[0], '#goodDay')
  t.deepEqual(tw.mentions[0], '@juaniviola')
})

test.serial('tweet with desc > 280', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })
  const desc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in volupasdasdsssss'
  let tw = null

  try {
    await twApi.saveTweet({
      user: u._id,
      description: desc
    })
  } catch (err) {
    tw = err
  }

  t.deepEqual(tw._message, 'Tweet validation failed')
})

test.serial('tweets by user', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })

  const tweet = await twApi.saveTweet({
    user: u._id,
    description: 'testing1'
  })

  const search1 = await twApi.tweetsByUser(u._id)

  t.deepEqual(search1[0].user.username, 'juaniviola')
  t.deepEqual(search1[0].user.email, 'juaniviola@gmail.com')
  t.deepEqual(search1[0].description, 'testing1')
})

test.serial('fav tweet', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })

  const tw = await twApi.saveTweet({
    user: u._id,
    description: '#Hello #guys'
  })

  const user = await userSchema.findOne({ username: 'viola' })
  await twApi.favTweet(tw._id, true, user)
  const tweet = await twSchema
    .findOne({ _id: tw._id })
    .populate({ path: 'favs', options: { select: { username: 1 } } })

  await twApi.favTweet(tw._id, false, user)
  const tweet2 = await twSchema
    .findOne({ _id: tw._id })
    .populate({ path: 'favs', options: { select: { username: 1 } } })

  t.deepEqual(tweet.favs[0]._id, user._id)
  t.deepEqual(tweet.favs[0].username, 'viola')
  t.deepEqual(tweet2.favs[0], undefined)
})

test.serial('edit tweet', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })

  const tweet = await twApi.saveTweet({
    user: u._id,
    description: 'Hola como va'
  })

  const up = await twApi.updateTweet(tweet._id, 'Hola #brother')
  const tw = await twSchema.findOne({ _id: tweet._id })

  t.deepEqual(tw.description, 'Hola #brother')
  t.deepEqual(tw.hashtags[0], '#brother')
})

test.serial('add answer', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })

  const tw = await twApi.saveTweet({
    user: u._id,
    description: 'Hola prueba'
  })

  const user = await userSchema.findOne({ username: 'viola' })
  const ans = await twApi.addAnswer(tw._id, user, 'Prueba')
  const tweet = await twSchema
    .findOne({ _id: tw._id })
    .populate({ path: 'answers.user', options: { select: { username: 1 } } })

  t.deepEqual(tweet.answers[0].user.username, 'viola')
  t.deepEqual(tweet.answers[0].description, 'Prueba')
})

test.serial('delete answer', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })

  const tw = await twApi.saveTweet({
    user: u._id,
    description: 'Hola prueba'
  })

  const user = await userSchema.findOne({ username: 'viola' })
  const addAns = await twApi.addAnswer(tw._id, user, 'Prueba')
  const tweet = await twSchema.findOne({ _id: tw._id })
  const delAns = await twApi.deleteAnswer(tweet._id, tweet.answers[0]._id)

  const ansDel = await twSchema.findOne({ _id: tw._id })

  t.deepEqual(ansDel.answers[0], undefined)
})

test.serial('delete tweet', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })

  const tweet = await twApi.saveTweet({
    user: u._id,
    description: 'Hola como andas'
  })

  const remove = await twApi.deleteTweet(tweet._id)
  const find = await twSchema.findOne({ _id: remove._id })

  t.deepEqual(find, null)
})

test.serial('tweets by hashtag', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })

  const tweet = await twApi.saveTweet({
    user: u._id,
    description: 'fucking #test'
  })

  const first = await twApi.tweetsByHashtag('#test')
  const second = await twApi.tweetsByHashtag('fucking')

  t.deepEqual(first.length, 1)
  t.deepEqual(first[0].hashtags[0], '#test')
  t.deepEqual(first[0].description, 'fucking #test')
  t.deepEqual(second.length, 0)
})

test.serial('tweets by following users', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })
  const user = await userSchema.findOne({ username: 'viola' })

  const tweet2 = await twApi.saveTweet({
    user: user._id,
    description: 'Hola broder x2'
  })

  await userApi.addFollower(u, user)
  const f = await twApi.tweetByFollowingUsers(u._id)

  t.deepEqual(f[0].user, user._id)
  t.deepEqual(f[0].description, 'Hola broder x2')
})
