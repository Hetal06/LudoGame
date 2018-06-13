const express = require('express');
    app = express();
    db = require('./db');
    socket = require('socket.io'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');

var UserController = require('./user/UserController');
app.use('/users', UserController);

var AuthController = require('./auth/AuthController');
app.use('/api/auth', AuthController);

module.exports = app;
