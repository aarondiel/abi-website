const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const logger = require('morgan');
const config = require('./config')
const mongodb = require('./datasource/mongodb')

const vote = require('./endpoints/vote/routes');
const frontend = require('./endpoints/frontend/routes');

// app
const app = express();

// middleware
app.use(logger("dev"));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// endpoints
app.use('/', frontend)
app.use('/api/vote', vote);

// handle next(error) calls
app.use((info, req, res, next) => {
  const { status, message } = info
  console.error(JSON.stringify(info, null, 2))
  res.status(status).send(message)
})

// startup
start = async () => {
  // connect to mongo
  await mongodb.connect()
  console.log('Connected to database')

  // start listening
  app.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`)
  })
}
start()
