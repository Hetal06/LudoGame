const express = require("express");
const app=express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../user/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const appConfig = require("../config/appConfig");
const VerifyToken = require("./VerifyToken");
const passport = require("passport");
const chalk = require("chalk");

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/register", function(req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  console.log("register api call", hashedPassword);
  User.create(
    {
      userId:req.body.userId, 
      userName: req.body.userName,
      password: hashedPassword,
      email: req.body.email,
      contactNo: req.body.contactNo,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      // spinId: req.body.spinId,
      // videoId: req.body.videoId,
      // coinId: req.body.coinId
    },
    function(err, user) {
      if (err)
        return res.status(500).json({
          status:"Error",
          auth:false,
          userId:null,
          message: "There was a problem registering the user.",
          user
        });
        var token=user._id;
      res.status(200).send({
        status:"Success",
        auth: true,
        userId: token,
        message:"You are successfull register",
         user
      });
     
    }
  );
});


router.get("/getAll", function(req, res) {
  User.find({}, function(err, register) {
    if (err) res.send(err);
    res.json(register);
  });
});



  
// router.post("/login", function(req, res) {
//   User.findOne({ email: req.body.email }, function(err, user) {
//     if (err) return res.status(500).send("Error on the server.");
//     if (!user) return res.status(404).send("No user found.");
//     var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
//     if (!passwordIsValid)
//       return res.status(401).send({ auth: false, token: null });
//     var token = jwt.sign({ id: user._id }, appConfig.secret, {
//       expiresIn: 86400 // expires in 24 hours
//     });
//     res.status(200).send({ auth: true, token: token });
//   });
// });

router.post("/login", function(req, res,next) {
  let requestedValues = req.body;
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
      message: "No appropriate data available for authenticating user",
      auth:false,
      token:null
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
            let token = jwt.sign({id:user._id}, appConfig.secret, {
              expiresIn: 1440 * 60 * 30 // expires in 1440 minutes/1 day
            });
            console.log(chalk.green("### Authorised User"));
            res.status(200).json({
              code: 200,
              status: "Success",
              message: "Authorised User!",
              auth: true,
              token:token
            });
            // res.status(200).send({ auth: true, token: token });
            token = null;
            return;
          } else {
            console.log("enter else if else");
            console.log(chalk.red("### Redirecting:Unauthorised Login"));
            res.status(403).json({
              code: 403,
              status: "Error",
              message: "Unauthorised Login! Enter valid Credentials",
              auth:false,
              token:null
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
            message: "Invalid Credentials! Try Again",
            auth:false,
            token:null
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
          message: "Required Fields are missing!",
          auth:false,
          token:null
        });
    }
  }
});


router.get("/me", VerifyToken, function(req, res, next) {
  var token = req.headers["x-access-token"];
  console.log("token is",token);
  if (!token)
    return res.status(401).send({ auth: false, message: "No token provided." });
  console.log("token is",token);
  jwt.verify(token, appConfig.secret, function(err, decoded) {
    if (err)
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });

        console.log("decode is",decoded);

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