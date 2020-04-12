const path = require('path')
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config({path: './.env'})
require('./config/config')

// SETTINGS

const app = express()

app.set('port', process.env.PORT || 5000)

app.use(cors())

app.use(bodyParser.json())

app.use(express.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', '*')
    return res.status(200).json({})
  }
  next()
})

//IMPORT ROUTES

const usersRoute = require('./routes/users')
const donationsRoute = require('./routes/donations')

//ROUTE MIDDLEWARES

app.use('/users', usersRoute);
app.use('/donation', donationsRoute);

//DB CONNECTION

mongoose.connect(process.env.URI_MONGO, { useUnifiedTopology: true, useNewUrlParser: true }, () => {
  console.log('connected to DB')
}).catch(error => console.log(error))

//LISTEN SERVER

app.listen(app.get('port'), () => {
  console.log(`serving on port ${app.get('port')}`);
})


app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred!'});
});
