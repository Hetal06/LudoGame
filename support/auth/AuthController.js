const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../user/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const appConfig = require("../config/appConfig");
const VerifyToken = require("./VerifyToken");
const passport = require('passport');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/register", function(req, res) {
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  console.log("register api call",hashedPassword);
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
        return res
          .status(500)
          .json({
            "message":"There was a problem registering the user."});
      // create a token
      // var token = jwt.sign({ id: user._id }, appConfig.secret, {
      //   expiresIn: 86400 // expires in 24 hours
      // });
      res.status(200).send({user});
      console.log("users ",user);
    }
  );
});

router.get("/getAll", function(req, res) {
User.find({}, function(err, register) {
  if (err)
    res.send(err);
  res.json(register);
});
});

router.post("/login", function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    console.log("user login",user);
    if (err) return res.status(500).json({"message":"Error on the server."});

    if (!user) return res.status(404).json({"message":"No user found."});

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid)
      return res.status(401).send({ auth: false, token: null });
    var token = jwt.sign({ id: user._id }, appConfig.secret, {
      expiresIn: 1440 * 60 * 30 // expires in 24 hours
    });
    res.status(200).json({ 
      "code": 200,
      "status":"Success",
      "authToken": token,
      "message":"Athorised User!"
     });
  });
});

app.post('/auth/facebook/token',
  passport.authenticate('facebook-token'),
  function (req, res) {
    console.log("login with facebook", res, "req :" ,req);
    // do something with req.user
    res.send(req.user? 200 : 401);
  }
);

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
