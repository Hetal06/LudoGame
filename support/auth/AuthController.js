const express = require("express");
const app=express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../user/User");
const config = require("../config/appConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const appConfig = require("../config/appConfig");
const VerifyToken = require("./VerifyToken");
const passport = require("passport");
const chalk = require("chalk");

router.get('/', (req, res) => {
  res.send('You are on the homepage');
});
// app.get('/', function (req, res) {
//   res.render('index', { title: 'Hey', message: 'Hello there!' })
// })
// const http=require("http").Server(app);
// const io=require("socket.io")(http);

// router.get('/index', function (req, res) {
//   res.send('About this wiki');
// })
// const _ = require("lodash");
// const async = require("async");
// const moment = require("moment");
// const mongoose = require("mongoose"); //For Mongodb Schema
// app.use(express.static(__dirname + '/public'));
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/register", function(req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  console.log("register api call", hashedPassword);
  User.create(
    {
      userName: req.body.userName,
      password: hashedPassword,
      email: req.body.email,
      contactNo: req.body.contactNo,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      spinId: req.body.spinId,
      videoId: req.body.videoId,
      coinId: req.body.coinId
    },
    function(err, user) {
      if (err)
        return res.status(500).json({
          message: "There was a problem registering the user."
        });
      res.status(200).send({ user });
      console.log("users ", user);
    }
  );
});

router.get("/getAll", function(req, res) {
  User.find({}, function(err, register) {
    if (err) res.send(err);
    res.json(register);
  });
});



  


router.post("/login", function(req, res,next) {
  let requestedValues = req.body;
  console.log(
    "requestedValues = ",
    requestedValues.email,
    "---",
    requestedValues.password
  );
  //  let isObject = await isValidObject(requestedValues);
  if (!requestedValues) {
    console.log("enter isobject");
    console.log(
      chalk.red(
        "### Redirecting: No appropriate data available for authenticating user!"
      )
    );
    res.status(403).json({
      code: 403,
      status: "Error",
      message: "No appropriate data available for authenticating user"
    });
    return;
  } else {
    if (requestedValues.email && requestedValues.password) {
      console.log(
        "3 requestedValues = ",
        requestedValues.email,
        "&&",
        requestedValues.password
      );
      User.findOne({ email: req.body.email }, function(err, user) {
        console.log("user = 11", user);
        if (user) {
          console.log("result = ", user);
          let validPassword = bcrypt.compareSync(
            requestedValues.password,
            user.password
          );
          // console.log("\n\nvalidPassword = ",validPassword);
          if (validPassword) {
            user.password = "";
            let payload = {};
            payload.email = user.email;
            payload.email = user.email;
            payload.email = user.email;
            // console.log("Plain Obj test ",_.isPlainObject(payload));
            let token = jwt.sign(payload, config.token.secret, {
              expiresIn: 1440 * 60 * 30 // expires in 1440 minutes/1 day
            });
            console.log(chalk.green("### Authorised User"));
            res.status(200).json({
              code: 200,
              status: "Success",
              authToken: token,
              message: "Authorised User!"
            });
            console.log("token is--", token);
            token = null;
            return;
          } else {
            console.log("enter else if else");
            console.log(chalk.red("### Redirecting:Unauthorised Login"));
            res.status(403).json({
              code: 403,
              status: "Error",
              message: "Unauthorised Login! Enter valid Credentials"
            });
            return;
          }
        } else {
          console.log(
            chalk.red("### Redirecting: No Record Found with provided UserName")
          );
          res.status(404).json({
            code: 404,
            status: "Error",
            message: "Invalid Credentials! Try Again"
          });
          return;
        }
      });
    } else {
      console.log("enter else 3...........");
      res
        .status(403)
        .json({
          code: 403,
          status: "Error",
          message: "Required Fields are missing!"
        });
    }
  }
});


// router.post("/login", function(req, res) {
//   User.findOne({ email: req.body.email }, function(err, user) {
//     console.log("user login", user);
//     if (err) return res.status(500).json({ message: "Error on the server." });

//     if (!user) return res.status(404).json({ message: "No user found." });

//     var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

//     if (!passwordIsValid)
//       return res.status(401).send({ auth: false, token: null });

//     var token = jwt.sign({ id: user._id }, appConfig.secret, {
//       expiresIn: 1440 * 60 * 30 // expires in 24 hours
//     });
//     console.log("token is:-", token);
//     res.status(200).json({
//       code: 200,
//       status: "Success",
//       authToken: token,
//       message: "Athorised User!"
//     });
//     var io = require("socket.io");
//     io.sockets.on("connection", function(socket) {
//       socket.emit("Start_Chat");
//       //On Event Registar_Name
//       socket.on("Register_Name", function(data) {
//         io.sockets.emit(
//           "r_name",
//           "<strong>" + data + "</strong> Has Joined The Chat"
//         );
//         //Now Listening To A Chat Message
//         socket.on("Send_msg", function(data) {
//           io.sockets.emit("msg", data);
//           //Now Listening To A Chat Message
//         });
//       });
//     });
//   });
// });

app.post("/facebook/token", passport.authenticate("facebook-token"), function(
  req,
  res
) {
  console.log("login with facebook", res, "req :", req);
  // do something with req.user
  res.send(req.user ? 200 : 401);
});

router.get("/me", VerifyToken, function(req, res, next) {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });

  jwt.verify(token, appConfig.secret, function(err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

    User.findById(req.userId, { password: 0 }, function(err, user) {
      if (err)
        return res.status(500).send("There was a problem finding the user.");
      if (!user) return res.status(404).send("No user found.");

      res.status(200).send(user);
    });
  });
});

// add the middleware function
router.use(function(user, req, res, next) {
  res.status(200).send(user);
});

router.get("/logout", function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;
