'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express')
const chalk = require('chalk')

const app = express()
const schema = require('./schema')

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

if (process.env.NODE_ENV === 'development') {
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))
}

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`${chalk.green('[Server] Listening on port ' + port)}`)
})
