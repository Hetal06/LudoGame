const express = require('express');
      app = express(),
      port = process.env.PORT || 3000,
      // https=require("https").Server(app),
      fs = require('fs'),
      db = require('./db'),
      mongoose = require("mongoose"),
      passport = require('passport'),
      bodyParser = require('body-parser'),
      FacebookTokenStrategy = require('passport-facebook-token'),
      // io=require("socket.io")(https);
      
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());

mongoose.Promise = global.Promise;
// mongoose.connect("mongodb://localhost/Ludo");
// mongoose.connect("mongodb://ludogame:ludogame123@ds235840.mlab.com:35840/myfirstdb");
mongoose.connect("mongodb://db_ludo:ludo123@ds125021.mlab.com:25021/ludogame");

passport.use(new FacebookTokenStrategy({
  clientID: "FACEBOOK_APP_ID",
  clientSecret: "FACEBOOK_APP_SECRET"
}, function(accessToken, refreshToken, profile, done) {
  let user = {
    'email': profile.emails[0].value,
    'name': profile.name.givenName + ' ' + profile.name.familyName,
    'id': profile.id,
    'token': accessToken
  };
  return done(null, user); 
}
));

app.use(passport.initialize());


var AuthController = require('./support/auth/AuthController');
app.use('/api/auth', AuthController);


module.exports = app;
// //Routing Request : http://localhost:port/
// app.get('/',function(request,response){
//   //Telling Browser That The File Provided Is A HTML File
//   response.writeHead(200,{"Content-Type":"text/html"});
//   //Passing HTML To Browser
//   response.write(fs.readFileSync("./public/index.html"));
//   //Ending Response
//   response.end();
// })
// //Routing To Public Folder For Any Static Context
// app.use(express.static(__dirname + '/public'));
// // var io = require('socket.io')(https);
// io.sockets.on("connection",function(socket){
//     socket.emit("Start_Chat");
//     //On Event Registar_Name
//     socket.on("Register_Name",function(data){
//        io.sockets.emit("r_name","<strong>"+data+"</strong> Has Joined The Chat");
//        //Now Listening To A Chat Message
//        socket.on("Send_msg",function(data){
//        io.sockets.emit("msg",data);
//        //Now Listening To A Chat Message
//     })
//     })
//   })


app.listen(port, function() {
	console.log("Express server listening on port : "+port );
});

