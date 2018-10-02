'use strict'

const test = require('ava')
const { graphql } = require('graphql')
const schema = require('../schema/index.js')
const chalk = require('chalk')

test.serial('it should pass', t => t.pass())

test.serial('hello world', async t => {
  const query = `
    query {
      helloWorld
    }
  `

  const result = await graphql(schema, query)
  const { data } = result

  t.deepEqual(data, { helloWorld: 'Hello world' })
})

let uId = null
let twId = null
let twUserId = null
let twUserSecure = null

test.serial('adding user', async t => {
  const query = `
    mutation addUser ($u: newUser!) {
      addUser(u: $u) {
        _id
        username
        fullName
      }
    }
  `

  const variables = {
    u: {
      username: 'juaniviola',
      fullName: 'Juani Viola',
      email: 'jv@gmail.com',
      password: 'ninguna'
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  uId = data.addUser._id
  t.deepEqual(data.addUser.username, 'juaniviola')
  t.deepEqual(data.addUser.fullName, 'Juani Viola')
})

test.serial('add tweet', async t => {
  const loginQuery = `
    mutation signin($user: login!) {
      signin(user: $user) {
        secure
      }
    }
  `
  const loginVariables = { user: { username: 'juaniviola', password: 'ninguna' } }
  const loginResult = await graphql(schema, loginQuery, null, null, loginVariables)
  const dataLogin = loginResult.data
  twUserSecure = dataLogin.signin.secure

  const query = `
    mutation addTweet ($tw: newTweet!) {
      addTweet(tw: $tw) {
        _id
        description
        hashtags
        user {
          _id
          username
        }
      }
    }
  `

  const variables = {
    tw: {
      user: uId,
      description: 'Good morning guys!!. #GoodDay #Relax',
      secure: twUserSecure
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  twId = data.addTweet._id
  twUserId = data.addTweet.user._id
  t.deepEqual(data.addTweet.user._id, uId)
  t.deepEqual(data.addTweet.user.username, 'juaniviola')
  t.deepEqual(data.addTweet.description, 'Good morning guys!!. #GoodDay #Relax')
  t.deepEqual(data.addTweet.hashtags[0], '#GoodDay')
  t.deepEqual(data.addTweet.hashtags[1], '#Relax')
})

test.serial('edit tweet', async t => {
  const query = `
    mutation editTweet ($tw: editTweet!) {
      editTweet(tw: $tw) {
        _id
        description
        hashtags
        mentions
        user {
          username
        }
      }
    }
  `

  const variables = {
    tw: {
      _id: twId,
      description: 'Hello @juaniviola how are you?? #Question',
      userId: twUserId,
      secure: twUserSecure
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.editTweet._id, twId)
  t.deepEqual(data.editTweet.user.username, 'juaniviola')
  t.deepEqual(data.editTweet.description, 'Hello @juaniviola how are you?? #Question')
  t.deepEqual(data.editTweet.hashtags[0], '#Question')
  t.deepEqual(data.editTweet.mentions[0], '@juaniviola')
})

test.serial('fav tweet', async t => {
  const query = `
    mutation favTw ($fav: favTweet!) {
      favTweet(fav: $fav) {
        description
        user {
          username
        }
        favs {
          username
          fullName
        }
      }
    }
  `

  const variables = {
    fav: {
      tweetId: twId,
      userId: uId,
      userSecure: twUserSecure
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.favTweet.user.username, 'juaniviola')
  t.deepEqual(data.favTweet.description, 'Hello @juaniviola how are you?? #Question')
  t.deepEqual(data.favTweet.favs.length, 1)
  t.deepEqual(data.favTweet.favs[0].username, 'juaniviola')
})

test.serial('delete fav', async t => {
  const query = `
    mutation delFav ($fav: favTweet!) {
      delFav(fav: $fav) {
        description
        favs {
          username
        }
        user {
          username
        }
      }
    }
  `

  const variables = {
    fav: {
      tweetId: twId,
      userId: uId,
      userSecure: twUserSecure
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.delFav.user.username, 'juaniviola')
  t.deepEqual(data.delFav.description, 'Hello @juaniviola how are you?? #Question')
  t.deepEqual(data.delFav.favs.length, 0)
  t.deepEqual(data.delFav.favs[0], undefined)
})

let answerId = null
test.serial('add answer to tweet', async t => {
  const query = `
    mutation addAnswer ($answer: addAnswer!) {
      addAnswer(answer: $answer) {
        description
        user {
          username
        }

        answers {
          _id
          description
          user {
            username
            fullName
          }
        }
      }
    }
  `

  const variables = {
    answer: {
      tweetId: twId,
      userId: uId,
      userSecure: twUserSecure,
      description: 'La banda!!'
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  answerId = data.addAnswer.answers[0]._id
  t.deepEqual(data.addAnswer.answers[0].user.username, 'juaniviola')
  t.deepEqual(data.addAnswer.answers[0].user.fullName, 'Juani Viola')
  t.deepEqual(data.addAnswer.answers[0].description, 'La banda!!')
})

test.serial('delete answer', async t => {
  const query = `
    mutation delAns ($answer: delAnswer!) {
      delAnswer(answer: $answer) {
        description
        answers {
          user {
            username
          }
        }
      }
    }
  `

  const variables = {
    answer: {
      tweetId: twId,
      userId: uId,
      answerId,
      userSecure: twUserSecure
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.delAnswer.answers[0], undefined)
})

test.serial('delete tweet', async t => {
  const query = `
    mutation a ($tw: deleteTweet!) {
      deleteTweet (tw: $tw)
    }
  `

  const variables = {
    tw: {
      userId: uId,
      tweetId: twId,
      userSecure: twUserSecure
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.deleteTweet, 'success')
})

let users = []
test.serial('many users', async t => {
  const query = `
    mutation adUs($u: newUser!, $user: login!) {
      addUser(u: $u) {
        _id
        username
        fullName
      }

      signin(user: $user) {
        secure
      }
    }
  `

  const variable = [
    { u: { username: 'juanito', fullName: 'Juani Viola', email: 'j@gmail.com', password: 'nop' }, user: { username: 'juanito', password: 'nop' } },
    { u: { username: 'viola', fullName: 'Ignacio Viola', email: 'juani@gmail.com', password: 'nop' }, user: { username: 'viola', password: 'nop' } },
    { u: { username: 'violanacho', fullName: 'Juan Ignacio', email: 'viola@gmail.com', password: 'nop' }, user: { username: 'violanacho', password: 'nop' } },
    { u: { username: 'juani.viola123', fullName: 'juan', email: 'niidea@gmail.com', password: 'nop' }, user: { username: 'juani.viola123', password: 'nop' } }
  ]

  const expect = [
    { addUser: { username: 'juanito', fullName: 'Juani Viola' } },
    { addUser: { username: 'viola', fullName: 'Ignacio Viola' } },
    { addUser: { username: 'violanacho', fullName: 'Juan Ignacio' } },
    { addUser: { username: 'juani.viola123', fullName: 'juan' } }
  ]

  for (let i = 0; i < variable.length; i++) {
    const variables = variable[i]
    const result = await graphql(schema, query, null, null, variables)
    const { data } = result

    users.push({ username: data.addUser.username, _id: data.addUser._id, secure: data.signin.secure })

    t.deepEqual(data.addUser.username, expect[i].addUser.username)
    t.deepEqual(data.addUser.fullName, expect[i].addUser.fullName)
  }
})

test.serial('add follow', async t => {
  const query = `
    mutation addFollow($follow: userFollow!) {
      addFollow(follow: $follow) {
        username

        following {
          username
        }

        followers {
          username
        }
      }
    }
  `

  const variable = [
    {
      follow: {
        userFromId: users[0]._id,
        userFromSecure: users[0].secure,
        userToId: users[1]._id
      }
    },
    {
      follow: {
        userFromId: users[0]._id,
        userFromSecure: users[0].secure,
        userToId: users[2]._id
      }
    },
    {
      follow: {
        userFromId: users[1]._id,
        userFromSecure: users[1].secure,
        userToId: users[0]._id
      }
    }
  ]

  const expect = [
    { addFollow: { username: 'juanito', following: [{ username: 'viola' }] } },
    { addFollow: { username: 'juanito', following: [{ username: 'viola'}, { username: 'violanacho' } ] } },
    { addFollow: { username: 'viola', following: [{ username:'juanito' }] } }
  ]

  for (let i=0; i<variable.length; i++) {
    const variables = variable[i]
    const result = await graphql(schema, query, null, null, variables)
    const { data } = result

    if (i === 2) {
      t.deepEqual(data.addFollow.username, expect[i].addFollow.username)
      t.deepEqual(data.addFollow.following, expect[i].addFollow.following)
      t.deepEqual(data.addFollow.followers[0].username, 'juanito')
    } else {
      t.deepEqual(data.addFollow.username, expect[i].addFollow.username)
      t.deepEqual(data.addFollow.following, expect[i].addFollow.following)
    }
  }
})

test.serial('delete follow', async t => {
  const query = `
    mutation delFoll($follow: userFollow!) {
      delFollow(follow: $follow) {
        username

        following {
          username
        }
      }
    }
  `

  const variables = {
    follow: {
      userFromId: users[0]._id,
      userFromSecure: users[0].secure,
      userToId: users[1]._id
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.delFollow.username, 'juanito')
  t.deepEqual(data.delFollow.following[0].username, 'violanacho')
})

let tweetId = null
test.serial('many tweets', async t => {
  const query = `
    mutation newTW ($tw: newTweet!) {
      addTweet(tw: $tw) {
        _id
        description
        hashtags
        user {
          username
        }
        favs {
          username
        }
      }
    }
  `

  const variable = [
    { tw: { description: 'Hello guys #goodMorning', user: users[0]._id, secure: users[0].secure } },
    { tw: { description: 'Viva la banda #labanda #niidea', user: users[0]._id, secure: users[0].secure } },
    { tw: { description: 'Hola mi nombre es #niidea', user: users[1]._id, secure: users[1].secure } },
    { tw: { description: 'Hola chavales #goodMorning', user: users[2]._id, secure: users[2].secure } }
  ]

  const expect = [
    { description: 'Hello guys #goodMorning', user: { username: 'juanito' }, hashtags: ['#goodMorning'] },
    { description: 'Viva la banda #labanda #niidea', user: { username: 'juanito' }, hashtags: ['#labanda', '#niidea'] },
    { description: 'Hola mi nombre es #niidea', user: { username: 'viola' }, hashtags: ['#niidea'] },
    { description: 'Hola chavales #goodMorning', user: { username: 'violanacho' }, hashtags: ['#goodMorning'] },
  ]

  for (let i=0; i<variable.length; i++) {
    const variables = variable[i]
    const result = await graphql(schema, query, null, null, variables)
    const { data } = result

    tweetId = data.addTweet._id
    t.deepEqual(data.addTweet.description, expect[i].description)
    t.deepEqual(data.addTweet.user.username, expect[i].user.username)
    t.deepEqual(data.addTweet.hashtags[0], expect[i].hashtags[0])
  }
})

test.serial('user by username', async t => {
  const query = `
    query us ($username: String!) {
      userByUsername(username: $username) {
        username
        fullName
      }
    }
  `

  const variables = {
    username: 'juaniviola'
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.userByUsername.username, 'juaniviola')
  t.deepEqual(data.userByUsername.fullName, 'Juani Viola')
})

test.serial('user by id', async t => {
  const query = `
    query usId ($id: objectId!) {
      userById (id: $id) {
        username
        fullName
      }
    }
  `

  const variables = {
    id: uId
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.userById.username, 'juaniviola')
  t.deepEqual(data.userById.fullName, 'Juani Viola')
})

test.serial('users by username', async t => {
  const query = `
    query ussby ($username: String!) {
      usersByUsername (username: $username) {
        username,
        fullName
      }
    }
  `

  const variables = {
    username: 'juani'
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.usersByUsername[0].username, 'juani.viola123')
  t.deepEqual(data.usersByUsername[1].username, 'juanito')
  t.deepEqual(data.usersByUsername[2].username, 'juaniviola')
})

test.serial('tweet by id', async t => {
  const query = `
    query twId ($id: objectId!) {
      tweetById (id: $id) {
        user {
          username
        }
        description
      }
    }
  `

  const variables = {
    id: tweetId
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.tweetById.user.username, 'violanacho')
  t.deepEqual(data.tweetById.description, 'Hola chavales #goodMorning')
})

test.serial('tweets by username', async t => {
  const query = `
    query twbyus ($user: objectId!) {
      tweetsByUsername (id: $user) {
        user {
          username
        }
        description
      }
    }
  `

  const juanitoId = users.find(({ username }) => username === 'juanito' )
  const variables = {
    user: juanitoId._id
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.tweetsByUsername[0].user.username, 'juanito')
  t.deepEqual(data.tweetsByUsername[1].user.username, 'juanito')
  t.deepEqual(data.tweetsByUsername[0].description, 'Hello guys #goodMorning')
})

test.serial('tweets by followingUsers', async t => {
  const query = `
    query twbyfus ($id: objectId!) {
      tweetsByFollowingUsers(id: $id) {
        description
        user {
          username
        }
        favs {
          username
        }
      }
    }
  `

  const violaId = users.find(({ username }) => username === 'viola' )
  const variables = {
    id: violaId._id
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.tweetsByFollowingUsers[0].user.username, 'juanito')
  t.deepEqual(data.tweetsByFollowingUsers[1].user.username, 'juanito')
  t.deepEqual(data.tweetsByFollowingUsers[0].description, 'Hello guys #goodMorning')
  t.deepEqual(data.tweetsByFollowingUsers[1].description, 'Viva la banda #labanda #niidea')
})

test.serial('tweets by hashtags', async t => {
  const query = `
    query twbyhash ($ht: String!) {
      tweetsByHashtags(hashtag: $ht) {
        user {
          username
        }
        description
        hashtags
      }
    }
  `

  const variables = {
    ht: '#goodMorning'
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.tweetsByHashtags[0].user.username, 'juanito')
  t.deepEqual(data.tweetsByHashtags[0].description, 'Hello guys #goodMorning')
  t.deepEqual(data.tweetsByHashtags[0].hashtags[0], '#goodMorning')

  t.deepEqual(data.tweetsByHashtags[1].user.username, 'violanacho')
  t.deepEqual(data.tweetsByHashtags[1].description, 'Hola chavales #goodMorning')
  t.deepEqual(data.tweetsByHashtags[1].hashtags[0], '#goodMorning')
})

test.serial('test errors parameters in addTweet', async t => {
  const query = `
    mutation add ($tw: newTweet!) {
      addTweet(tw: $tw) {
        _id
        description
        user {
          username
        }
      }
    }
  `

  const variables = {
    tw: {
      secure: users[1].secure,
      description: 'asd'
    }
  }

  const result = await graphql(schema, query, null, null, variables)

  t.deepEqual(result.errors[0].message, 'Invalid parameters')
})

test.serial('testing errors adding an existing user', async t => {
  const query = `
    mutation add ($u: newUser!) {
      addUser(u: $u) {
        _id
        username
      }
    }
  `

  const variables = {
    u: {
      username: 'juaniviola',
      email: 'aaa@s.com',
      fullName: 'jaja',
      password: 'aaa'
    }
  }

  const result = await graphql(schema, query, null, null, variables)

  t.deepEqual(result.errors[0].message, 'User with username already exists')
})

test.serial('testing errors adding an existing user with email', async t => {
  const query = `
    mutation add ($u: newUser!) {
      addUser(u: $u) {
        _id
        username
      }
    }
  `

  const variables = {
    u: {
      username: 'elJuaniViola',
      email: 'jv@gmail.com',
      fullName: 'jaja',
      password: 'aaa'
    }
  }

  const result = await graphql(schema, query, null, null, variables)

  t.deepEqual(result.errors[0].message, 'User with email already exists')
})

test.serial('testing error signin user', async t => {
  const query = `
    mutation signin($user: login!) {
      signin(user: $user) {
        secure
      }
    }
  `

  const variables = { user: { username: 'juaniviola', password: 'null_password...' } }

  const result = await graphql(schema, query, null, null, variables)

  t.deepEqual(result.errors[0].message, 'User and password do not match')
})

test.serial('testing error edit tweet', async t => {
  const query = `
    mutation editTweet ($tw: editTweet!) {
      editTweet(tw: $tw) {
        _id
        description
        hashtags
        mentions
        user {
          username
        }
      }
    }
  `

  const variables = {
    tw: {
      _id: twId,
      description: 'Hello @juaniviola how are you?? #Question',
      userId: twUserId,
      secure: twUserSecure
    }
  }

  const result = await graphql(schema, query, null, null, variables)

  t.deepEqual(result.errors[0].message, 'Tweet not found')
})

test.serial('testing error fav tweet and delete tweet', async t => {
  // add tweet
  const query = `
    mutation favTw ($fav: favTweet!) {
      favTweet(fav: $fav) {
        description
        user {
          username
        }
        favs {
          username
          fullName
        }
      }
    }
  `

  const variables = {
    fav: {
      tweetId: twId,
      userId: uId,
      userSecure: 'asddsa'
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  t.deepEqual(result.errors[0].message, 'Unhauthorized')

  // delete tweet
  const query2 = `
    mutation favTw ($fav: favTweet!) {
      delFav(fav: $fav) {
        description
        user {
          username
        }
        favs {
          username
          fullName
        }
      }
    }
  `

  const variables2 = {
    fav: {
      userId: uId,
      userSecure: twUserSecure
    }
  }

  const result2 = await graphql(schema, query2, null, null, variables2)
  t.deepEqual(result2.errors[0].message, 'Invalid parameters')
})

test.serial('testing error answer', async t => {
  // add answer
  const query = `
    mutation addAnswer($answer: addAnswer!) {
      addAnswer(answer: $answer) {
        description
      }
    }
  `

  const variables = {
    answer: {
      tweetId: 'foobar',
      userId: uId,
      userSecure: twUserSecure,
      description: 'Test!!'
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  t.deepEqual(result.errors[0].message, 'Invalid id')

  // delete answer
  const query2 = `
    mutation delAnswer($answer: delAnswer!) {
      delAnswer(answer: $answer) {
        description
      }
    }
  `

  const variables2 = {
    answer: {
      tweetId: uId,
      userId: uId,
      userSecure: twUserSecure
    }
  }

  const result2 = await graphql(schema, query2, null, null, variables2)
  t.deepEqual(result2.errors[0].message, 'Invalid parameters')
})

test.serial('testing error follow', async t => {
  const query = `
    mutation addFollow($follow: userFollow!) {
      addFollow(follow: $follow) {
        username

        following {
          username
        }

        followers {
          username
        }
      }
    }
  `

  const variables = {
    follow: {
      userFromId: 'foobar',
      userFromSecure: 'foobar2',
      userToId: 'foobar3'
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  t.deepEqual(result.errors[0].message, 'Invalid id')
})
