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

const users = []
let u = null
let user = null

test.before(async t => {
  await mongoose.connect(mongoUrl, { useNewUrlParser: true })

  await twSchema.deleteMany()
  await userSchema.deleteMany()

  const _users = [{
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

  const _signin = [{
    username: 'juaniviola',
    password: 'none'
  }, {
    username: 'viola',
    password: 'ninguna'
  }]

  for (let i=0; i<_users.length; i++) {
    const us = await userApi.saveUser(_users[i])

    const sec = await userApi.signin({ user: _signin[i] })

    users.push({
      _id: us._id,
      username: us.username,
      secure: sec.secure
    })
  }

  u = users[0]
  user = users[1]
})

test.beforeEach(async () => {
  await twSchema.deleteMany()
})

test.serial('pass', t => t.pass())

test.serial('add tweet', async t => {
  const tw = await twApi.saveTweet({
    user: u._id,
    secure: u.secure,
    description: 'Hello guys. #goodDay. How are you @juaniviola ?'
  })

  const tw2 = await twApi.saveTweet({
    user: 'asddsa',
    secure: u.secure,
    description: 'Hello guys. #goodDay. How are you @juaniviola ?'
  })

  const tw3 = await twApi.saveTweet({
    user: u._id,
    secure: u.secure
  })

  const otherTw = await twApi.saveTweet({
    user: u._id,
    secure: 'foobar',
    description: 'testing'
  })

  t.deepEqual(tw.user.username, 'juaniviola')
  t.deepEqual(tw.description, 'Hello guys. #goodDay. How are you @juaniviola ?')
  t.deepEqual(tw.hashtags[0], '#goodDay')
  t.deepEqual(tw.mentions[0], '@juaniviola')

  t.deepEqual(tw2.error.message, 'Invalid user id')
  t.deepEqual(tw3.error.message, 'Invalid parameters')
  t.deepEqual(otherTw.error.message, 'Unhauthorized')
})

test.serial('tweet with desc > 280', async t => {
  const desc = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in volupasdasdsssss'

   const tw = await twApi.saveTweet({
    user: u._id,
    secure: u.secure,
    description: desc
  })

  t.deepEqual(tw.error.message, 'Maximum of characters exceeded')
})

test.serial('tweets by user', async t => {
  const tweets = [{
    user: u._id,
    secure: u.secure,
    description: 'testing1'
  }, {
    user: u._id,
    secure: u.secure,
    description: 'La banda'
  }, {
    user: u._id,
    secure: u.secure,
    description: 'Hello guys #hello'
  }]

  for (let i=0; i<tweets.length; i++) {
    await twApi.saveTweet(tweets[i])
  }

  const search1 = await twApi.tweetsByUser(u._id)
  const search2 = await twApi.tweetsByUser('asddsa')

  t.deepEqual(search1[0].user.username, 'juaniviola')
  t.deepEqual(search1[0].description, 'testing1')
  t.deepEqual(search1[1].description, 'La banda')
  t.deepEqual(search1[2].description, 'Hello guys #hello')
  t.deepEqual(search1[2].hashtags[0], '#hello')

  t.deepEqual(search2.error.message, 'Invalid user id')
})

test.serial('tweet by id', async t => {
  const tw = await twApi.saveTweet({
    user: u._id,
    secure: u.secure,
    description: 'Holaa!'
  })

  const search = await twApi.tweetById(tw._id)
  const failSearch = await twApi.tweetById('foobar')

  t.deepEqual(search.user.username, 'juaniviola')
  t.deepEqual(search.description, 'Holaa!')

  t.deepEqual(failSearch.error.message, 'Invalid id')
})

test.serial('fav tweet', async t => {
  const tw = await twApi.saveTweet({
    user: u._id,
    secure: u.secure,
    description: '#Hello #guys'
  })

  const tweet = await twApi.favTweet({
    fav: {
      tweetId: tw._id,
      fav: true,
      userId: user._id,
      userSecure: user.secure
    }
  })

  const tweet2 = await twApi.favTweet({
    fav: {
      tweetId: tw._id,
      fav: false,
      userId: user._id,
      userSecure: user.secure
    }
  })

  const twSec = await twApi.favTweet({
    fav: {
      tweetId: tw._id,
      fav: true,
      userId: user._id,
      userSecure: 'foobar'
    }
  })

  const twParam = await twApi.favTweet({
    fav: {
      tweetId: tw._id,
      fav: true,
      userSecure: user.secure
    }
  })

  const _tweetId = await twApi.favTweet({
    fav: {
      tweetId: tw._id,
      fav: true,
      userId: 'fooBar',
      userSecure: user.secure
    }
  })

  t.deepEqual(tweet.favs.length, 1)
  t.deepEqual(tweet.favs[0]._id, user._id)
  t.deepEqual(tweet.favs[0].username, 'viola')

  t.deepEqual(tweet2.user.username, 'juaniviola')
  t.deepEqual(tweet2.favs[0], undefined)

  t.deepEqual(twSec.error.message, 'Unhauthorized')
  t.deepEqual(twParam.error.message, 'Invalid parameters')
  t.deepEqual(_tweetId.error.message, 'Invalid id')
})

test.serial('edit tweet', async t => {
  const tweet = await twApi.saveTweet({
    user: u._id,
    secure: u.secure,
    description: 'Hola como va'
  })

  const up = await twApi.updateTweet({
    tw: {
      _id: tweet._id,
      description: 'Hola #brother',
      secure: u.secure,
      userId: u._id
    }
  })

  const up2 = await twApi.updateTweet({ tw: { _id: tweet._id } })

  const up3 = await twApi.updateTweet({
    tw: {
      _id: tweet._id,
      description: 'Hola #braoni',
      secure: 'foobar',
      userId: u._id
    }
  })

  const up4 = await twApi.updateTweet({
    tw: {
      _id: 'foooo',
      description: 'Hola #braoni',
      secure: u.secure,
      userId: u._id
    }
  })

  const up5 = await twApi.updateTweet({
    tw: {
      _id: tweet._id,
      description: 'Hola #braoni',
      secure: user.secure,
      userId: user._id
    }
  })

  t.deepEqual(tweet.user.username, 'juaniviola')
  t.deepEqual(tweet.description, 'Hola como va')

  t.deepEqual(up.user.username, 'juaniviola')
  t.deepEqual(up.description, 'Hola #brother')
  t.deepEqual(up.hashtags[0], '#brother')

  t.deepEqual(up2.error.message, 'Invalid parameters')
  t.deepEqual(up3.error.message, 'Unhauthorized')
  t.deepEqual(up4.error.message, 'Invalid id')
  t.deepEqual(up5.error.message, 'Unhauthorized')
})

test.serial('add answer', async t => {
  const tw = await twApi.saveTweet({
    user: u._id,
    secure: u.secure,
    description: 'Hola prueba'
  })

  const ans = await twApi.addAnswer({
    answer: {
      tweetId: tw._id,
      userId: user._id,
      userSecure: user.secure,
      description: 'Prueba'
    }
  })

  const invalidAns = await twApi.addAnswer({
    answer: {
      tweetId: tw._id,
      userId: user._id,
      description: 'Prueba'
    }
  })

  const invalidId = await twApi.addAnswer({
    answer: {
      tweetId: tw._id,
      userId: 'foobar',
      userSecure: user.secure,
      description: 'Prueba'
    }
  })

  const invalidSecure = await twApi.addAnswer({
    answer: {
      tweetId: tw._id,
      userId: user._id,
      userSecure: 'foobar',
      description: 'Prueba'
    }
  })

  t.deepEqual(ans.answers.length, 1)
  t.deepEqual(ans.answers[0].user.username, 'viola')
  t.deepEqual(ans.answers[0].description, 'Prueba')

  t.deepEqual(invalidAns.error.message, 'Invalid parameters')
  t.deepEqual(invalidId.error.message, 'Invalid id')
  t.deepEqual(invalidSecure.error.message, 'Unhauthorized')
})

test.serial('delete answer', async t => {
  const tw = await twApi.saveTweet({
    user: u._id,
    secure: u.secure,
    description: 'Hola prueba'
  })

  const addAns = await twApi.addAnswer({
    answer: {
      tweetId: tw._id,
      userId: user._id,
      userSecure: user.secure,
      description: 'Prueba'
    }
  })

  const paramInvalidAns = await twApi.deleteAnswer({
    answer: {
      tweetId: tw._id,
      userId: user._id,
      answerId: addAns.answers[0]._id
    }
  })

  const idInvalidAns = await twApi.deleteAnswer({
    answer: {
      tweetId: tw._id,
      userId: 'foobar',
      userSecure: user.secure,
      answerId: addAns.answers[0]._id
    }
  })

  const secureInvalidAns = await twApi.deleteAnswer({
    answer: {
      tweetId: tw._id,
      userId: user._id,
      userSecure: 'foobar',
      answerId: addAns.answers[0]._id
    }
  })

  const anyAnswer = await twApi.deleteAnswer({
    answer: {
      tweetId: tw._id,
      userId: user._id,
      userSecure: user.secure,
      answerId: tw._id
    }
  })

  const anyUser = await twApi.deleteAnswer({
    answer: {
      tweetId: tw._id,
      userId: u._id,
      userSecure: u.secure,
      answerId: addAns.answers[0]._id
    }
  })

  const delAns = await twApi.deleteAnswer({
    answer: {
      tweetId: tw._id,
      userId: user._id,
      userSecure: user.secure,
      answerId: addAns.answers[0]._id
    }
  })

  t.deepEqual(addAns.answers.length, 1)
  t.deepEqual(addAns.answers[0].user.username, 'viola')
  t.deepEqual(addAns.answers[0].description, 'Prueba')
  t.deepEqual(delAns.answers.length, 0)

  t.deepEqual(paramInvalidAns.error.message, 'Invalid parameters')
  t.deepEqual(idInvalidAns.error.message, 'Invalid id')
  t.deepEqual(secureInvalidAns.error.message, 'Unhauthorized')
  t.deepEqual(anyAnswer.error.message, 'Answer not found')
  t.deepEqual(anyUser.error.message, 'Unhauthorized')
})

test.serial('delete tweet', async t => {
  const tweet = await twApi.saveTweet({
    user: u._id,
    secure: u.secure,
    description: 'Hola como andas'
  })

  const inRemove = await twApi.deleteTweet({
    tw: {
      tweetId: tweet._id,
      userSecure: u.secure
    }
  })

  const inRemoveId = await twApi.deleteTweet({
    tw: {
      tweetId: tweet._id,
      userId: 'fooBar',
      userSecure: u.secure
    }
  })

  const inRemoveSecure = await twApi.deleteTweet({
    tw: {
      tweetId: tweet._id,
      userId: u._id,
      userSecure: 'foobar'
    }
  })

  const inRemoveUser = await twApi.deleteTweet({
    tw: {
      tweetId: tweet._id,
      userId: user._id,
      userSecure: user.secure
    }
  })

  const remove = await twApi.deleteTweet({
    tw: {
      tweetId: tweet._id,
      userId: u._id,
      userSecure: u.secure
    }
  })

  const find = await twSchema.findOne({ _id: remove._id })

  t.deepEqual(find, null)
  t.deepEqual(inRemoveUser.error.message, 'Unhauthorized')
  t.deepEqual(inRemoveSecure.error.message, 'Unhauthorized')
  t.deepEqual(inRemoveId.error.message, 'Invalid id')
  t.deepEqual(inRemove.error.message, 'Invalid parameters')
})

test.serial('tweets by hashtag', async t => {
  const tweet = await twApi.saveTweet({
    user: u._id,
    secure: u.secure,
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
  const tweet2 = await twApi.saveTweet({
    user: user._id,
    secure: user.secure,
    description: 'Hola broder x2'
  })

  await userApi.addFollower({
    follow: {
      userFromId: u._id,
      userFromSecure: u.secure,
      userToId: user._id
    }
  })

  const fail = await twApi.tweetByFollowingUsers('foobar')
  const qsy = await twApi.tweetByFollowingUsers('5bb1587889f7714453b18175')
  const f = await twApi.tweetByFollowingUsers(u._id)

  t.deepEqual(f[0].user.username, 'viola')
  t.deepEqual(f[0].description, 'Hola broder x2')

  t.deepEqual(fail.error.message, 'Invalid id')
  t.deepEqual(qsy.error.message, 'User not found')
})

test.serial('tweet with any secure code', async t => {
  const tw = await twApi.saveTweet({
    user: u._id,
    secure: 'anyyyy',
    description: 'xd'
  })

  t.deepEqual(tw.error.message, 'Unhauthorized')
  t.deepEqual(tw.user, undefined)
})

test.serial('tweet with undefined user', async t => {
  const tw = await twApi.saveTweet({
    user: 'foo_bar',
    secure: u.secure,
    description: 'testing...'
  })

  t.deepEqual(tw.error.message, 'Invalid user id')
})
