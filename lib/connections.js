'use strict'

const mongoose = require('mongoose')
const chalk = require('chalk')
require("dotenv").config()

exports.connectDB = () => {
  const options = {
    dbName: process.env.DB_NAME,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  }

  mongoose.connect(process.env.MONGODB_URI, options, (err) => {
    err ?
      console.error(chalk.red(`\nError opening the database\n`), err) :
      console.log(chalk.green(`\nThe database has been opened correctly\n`))
  })
}
