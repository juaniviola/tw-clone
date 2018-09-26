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

  const users = [{
    username: 'juaniviola',
    email: 'juaniviola@gmail.com',
    fullName: 'juani viola',
    password: 'none'
  }, {
    username: 'viola',
    email: 'viola@gmail.com',
    fullName: 'viola',
    password: 'ninguna'
  }]

  for (let i=0; i<users.length; i++) {
    await userApi.saveUser(users[i])
  }
})

test.beforeEach(async () => {
  await twSchema.deleteMany()
})

test.serial('pass', t => t.pass())

test.serial('add tweet', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })

  const tw = await twApi.saveTweet({
    user: u._id,
    description: 'Hello guys. #goodDay. How are you @juaniviola ?'
  })

  t.deepEqual(tw.user.username, 'juaniviola')
  t.deepEqual(tw.description, 'Hello guys. #goodDay. How are you @juaniviola ?')
  t.deepEqual(tw.hashtags[0], '#goodDay')
  t.deepEqual(tw.mentions[0], '@juaniviola')
})

test.serial('tweet with desc > 280', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })
  const desc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in volupasdasdsssss'
  let tw = null

  try {
    tw = await twApi.saveTweet({
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

  const tweets = [{
    user: u._id,
    description: 'testing1'
  }, {
    user: u._id,
    description: 'La banda'
  }, {
    user: u._id,
    description: 'Hello guys #hello'
  }]

  for (let i=0; i<tweets.length; i++) {
    await twApi.saveTweet(tweets[i])
  }

  const search1 = await twApi.tweetsByUser(u._id)

  t.deepEqual(search1[0].user.username, 'juaniviola')
  t.deepEqual(search1[0].description, 'testing1')
  t.deepEqual(search1[1].description, 'La banda')
  t.deepEqual(search1[2].description, 'Hello guys #hello')
  t.deepEqual(search1[2].hashtags[0], '#hello')
})

test.serial('fav tweet', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })
  const user = await userSchema.findOne({ username: 'viola' })

  const tw = await twApi.saveTweet({
    user: u._id,
    description: '#Hello #guys'
  })

  await twApi.favTweet(tw._id, true, user)
  const tweet = await twApi.tweetById(tw._id)

  await twApi.favTweet(tw._id, false, user)
  const tweet2 = await twApi.tweetById(tw._id)

  t.deepEqual(tweet.favs.length, 1)
  t.deepEqual(tweet.favs[0]._id, user._id)
  t.deepEqual(tweet.favs[0].username, 'viola')

  t.deepEqual(tweet2.user.username, 'juaniviola')
  t.deepEqual(tweet2.favs[0], undefined)
})

test.serial('edit tweet', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })

  const tweet = await twApi.saveTweet({
    user: u._id,
    description: 'Hola como va'
  })

  const up = await twApi.updateTweet(tweet._id, 'Hola #brother')

  t.deepEqual(tweet.user.username, 'juaniviola')
  t.deepEqual(tweet.description, 'Hola como va')

  t.deepEqual(up.user.username, 'juaniviola')
  t.deepEqual(up.description, 'Hola #brother')
  t.deepEqual(up.hashtags[0], '#brother')
})

test.serial('add answer', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })

  const tw = await twApi.saveTweet({
    user: u._id,
    description: 'Hola prueba'
  })

  const user = await userSchema.findOne({ username: 'viola' })
  const ans = await twApi.addAnswer(tw._id, user, 'Prueba')

  t.deepEqual(ans.answers.length, 1)
  t.deepEqual(ans.answers[0].user.username, 'viola')
  t.deepEqual(ans.answers[0].description, 'Prueba')
})

test.serial('delete answer', async t => {
  const u = await userSchema.findOne({ username: 'juaniviola' })

  const tw = await twApi.saveTweet({
    user: u._id,
    description: 'Hola prueba'
  })

  const user = await userSchema.findOne({ username: 'viola' })
  const addAns = await twApi.addAnswer(tw._id, user, 'Prueba')
  const delAns = await twApi.deleteAnswer(tw._id, addAns.answers[0]._id)

  t.deepEqual(addAns.answers.length, 1)
  t.deepEqual(addAns.answers[0].user.username, 'viola')
  t.deepEqual(addAns.answers[0].description, 'Prueba')
  t.deepEqual(delAns.answers.length, 0)
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

  t.deepEqual(f[0].user.username, 'viola')
  t.deepEqual(f[0].description, 'Hola broder x2')
})

test.todo('errors')
