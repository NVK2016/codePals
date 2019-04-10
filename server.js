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

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* 
// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" })); */

// Static directory
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

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
