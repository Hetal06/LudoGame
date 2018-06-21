const app = require("./app");
port = process.env.PORT || 4000;
mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/Ludo");

let server = app.listen(port, function() {
  console.log("Express server listening on port " + port);
});

