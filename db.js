// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/Ludo');

/*
File: appConfig.js
App Name: Ludo Game
Purpose: Configuration Part for Server and Database
Created By: Hetal Thakkar */

'use strict'
module.exports ={
  "db" :{           //Database Configuration
          "port"		: 27017,
          "dbName"	: 'LudoGame',
          "authDb"	: 'admin',
          "url"		  : 'mongodb://localhost:27017/meandemo',
          "host"    : 'localhost',

        },
  "server": {       //Server Configuration
          // "name":"Venus Stock Manager",
          "port":4000
        },
  "token": {
          "secret": "ludogamesecretkey"
        }
}
           