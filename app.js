const express = require('express');
    app = express();
    db = require('./db');
   

var UserController = require('./user/UserController');
app.use('/users', UserController);

var AuthController = require('./auth/AuthController');
app.use('/api/auth', AuthController);

module.exports = app;
