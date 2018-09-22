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

  // console.log(result)

  uId = data.addUser._id
  t.deepEqual(data.addUser.username, 'juaniviola')
  t.deepEqual(data.addUser.fullName, 'Juani Viola')
})

test.serial('add tweet', async t => {
  const query = `
    mutation addTweet ($tw: newTweet!) {
      addTweet(tw: $tw) {
        _id
        description
        hashtags
        user {
          username
        }
      }
    }
  `

  const variables = {
    tw: {
      user: uId,
      description: 'Good morning guys!!. #GoodDay #Relax'
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  twId = data.addTweet._id
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
      }
    }
  `

  const variables = {
    tw: {
      _id: twId,
      description: 'Hello @juaniviola how are you?? #Question'
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.editTweet._id, twId)
  t.deepEqual(data.editTweet.description, 'Hello @juaniviola how are you?? #Question')
  t.deepEqual(data.editTweet.hashtags[0], '#Question')
  t.deepEqual(data.editTweet.mentions[0], '@juaniviola')
})

test.serial('fav tweet', async t => {
  const query = `
    mutation favTw ($id: objectId!, $user: twUser!) {
      favTweet(id: $id, user: $user) {
        description
        favs {
          username
          fullName
        }
      }
    }
  `

  const variables = {
    id: twId,
    user: {
      _id: uId
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.favTweet.favs.length, 1)
  t.deepEqual(data.favTweet.favs[0].username, 'juaniviola')
})

test.serial('delete fav', async t => {
  const query = `
    mutation delFav ($id: objectId!, $user: twUser!) {
      delFav(id: $id, user: $user) {
        description
        favs {
          username
        }
      }
    }
  `

  const variables = {
    id: twId,
    user: {
      _id: uId
    }
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.delFav.favs.length, 0)
  t.deepEqual(data.delFav.favs[0], undefined)
})

let answerId = null
test.serial('add answer to tweet', async t => {
  const query = `
    mutation addAnswer ($id: objectId!, $user: twUser!, $description: String!) {
      addAnswer(id: $id, user: $user, description: $description) {
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
    id: twId,
    user: {
      _id: uId
    },
    description: 'La banda!!'
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
    mutation delAns ($id: objectId!, $ansId: objectId!) {
      delAnswer(id: $id, ansId: $ansId) {
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
    id: twId,
    ansId: answerId
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.delAnswer.answers[0], undefined)
})

test.serial('delete tweet', async t => {
  const query = `
    mutation a ($id: objectId!) {
      deleteTweet (id: $id)
    }
  `

  const variables = {
    id: twId
  }

  const result = await graphql(schema, query, null, null, variables)
  const { data } = result

  t.deepEqual(data.deleteTweet, 'success')
})

let users = []
test.serial('many users', async t => {
  const query = `
    mutation adUs($u: newUser!) {
      addUser(u: $u) {
        _id
        username
        fullName
      }
    }
  `

  const variable = [
    { u: { username: 'juanito', fullName: 'Juani Viola', email: 'j@gmail.com', password: 'nop' } },
    { u: { username: 'viola', fullName: 'Ignacio Viola', email: 'juani@gmail.com', password: 'nop' } },
    { u: { username: 'violanacho', fullName: 'Juan Ignacio', email: 'viola@gmail.com', password: 'nop' } },
    { u: { username: 'juani.viola123', fullName: 'juan', email: 'niidea@gmail.com', password: 'nop' } }
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

    users.push({ username: data.addUser.username, _id: data.addUser._id })

    t.deepEqual(data.addUser.username, expect[i].addUser.username)
    t.deepEqual(data.addUser.fullName, expect[i].addUser.fullName)
  }
})

test.todo('add follow')

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
    { tw: { description: 'Hello guys #goodMorning', user: users[0]._id } },
    { tw: { description: 'Viva la banda #labanda #niidea', user: users[0]._id } },
    { tw: { description: 'Hola mi nombre es #niidea', user: users[1]._id } },
    { tw: { description: 'Hola chavales #goodMorning', user: users[2]._id } }
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

    t.deepEqual(data.addTweet.description, expect[i].description)
    t.deepEqual(data.addTweet.user.username, expect[i].user.username)
    t.deepEqual(data.addTweet.hashtags[0], expect[i].hashtags[0])
  }
})
