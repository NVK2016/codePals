// *********************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
// *********************************************************************************

// Set up ======================================================
// require("dotenv").config();

// Dependencies
// =============================================================
var express = require("express");
var bodyParser = require("body-parser");

var db = require("./models");
var passport = require('passport');
var session = require('express-session');


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

//use local-stratey defined in config folder
require('./config/passport')(passport);

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public/assets/img', express.static(__dirname + '/public/assets/img'));
app.use('/public/assets/css', express.static(__dirname + '/public/assets/css'));


// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

var hbs = exphbs.create({
  // Specify helpers which are only registered on this instance.
  helpers: {
      renderProjectType: function (projType) { if(projType === "project")return true;},
  }
});

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


//Using session
app.use(session({
  key: 'user_sid',
  secret: 'goN6DJJC6E287cC77kkdYuNuAyWnz7Q3iZj8',
  resave: true,
  saveUninitialized: false,
  cookie: {
    expires: 600000,
    httpOnly: false
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Routes
// =============================================================

// Require our routes into the application.
require('./routes/html-routes')(app);
require('./routes/activity-api-routes')(app);
require('./routes/user-api-routes')(app);



// Starts the server to begin listening
// =============================================================

db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log('API Server now listening on PORT ' + PORT);
  });
});
