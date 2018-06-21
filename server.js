const app = require("./app");
port = process.env.PORT || 3000,
mongoose = require("mongoose");
const passport = require('passport');
var FacebookTokenStrategy = require('passport-facebook-token');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/Ludo");

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

let server = app.listen(port, function() {
	console.log("Express server listening on port " + port)
});



