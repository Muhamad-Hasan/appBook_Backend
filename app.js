'use strict';

var express = require('express');
let path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
let helmet = require('helmet');
var cors = require('cors');
var appRoutes = require('./backend/routes/app.routes');


mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(res=> console.log("DB Connected Successfully" ))
  .catch(err=>console.log('Unable to connect with DB'))

 
var app = express();

app.use(logger('dev'));
app.use(helmet()); 
app.use(express.json());
// app.use(express.static('assets'));
app.use('/assets', express.static(process.cwd() + '/assets'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use(express.static(path.join(__dirname, '/build')));
app.use('/api/v1', appRoutes);
app.get('/*', function(req, res) {
  return res.status(500).json({message: 'Invalid path'});
 // res.sendFile(path.join(__dirname + '/build/index.html'));
});
process.on('uncaughtException', (err, origin) => {
  console.log("uncaughtException Error ------>",err);
});

module.exports = app;
