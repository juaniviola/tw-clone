'use strict'

const test = require('ava')
const { graphql } = require('graphql')
const schema = require('../schema/index.js')

test.serial('it should pass', t => t.pass())

test.serial('query test should return hello world', async t => {
  const query = `
    query {
      test
    }
  `

  const result = await graphql(schema, query)
  const { data } = result

  t.deepEqual(data, { test: 'Hello world' })
})
