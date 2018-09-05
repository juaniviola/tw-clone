'use strict'

const mongoose = require('mongoose')
const chalk = require('chalk')
const mongoUrl = 'mongodb://127.0.0.1:27017/tw-clone'

mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .then(() => console.log(chalk.green('Conectado a la database')))
  .catch(err => console.log(chalk.red(`Error: ${err}`)))
