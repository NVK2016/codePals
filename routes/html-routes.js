// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

var db = require("../models");

console.log("HTML Route file"); 

// Routes
// =============================================================
module.exports = function (app) {
    
    //Welcome page 
    app.get("/", function (req, res) {
        console.log("Welcome page ", res);
        res.render("index");
    });

    //Login page 
    app.get("/login", function (req, res) {
        console.log("Welcome exisiting user logging into system", res);
        //Render the index handle bar 
        res.render("login", res);
    });

     //Sigin Up page 
     app.get("/signup", function (req, res) {
        console.log("Creating a new account", res);
        //Render the index handle bar 
        res.render("signup", res);
    });

    //New Activity Form 
    app.get("/addactivity", function (req, res) {
        console.log("Creating a new Activity", res);
        //Render the dashboard html 
        res.render("createActivity", res);
    });

    //Making it secure while transferrign data from client-side to server 
    app.get("/dashboard", function (req, res) {
        console.log("Navigate to dashboard", res);
        //Render the dashboard html 
        res.render("dashboard", res);
    });

    //View All Members in the site 
    app.get("/users", function (req, res) {
        console.log("Display all members and their skills", res);
        //Render the dashboard html 
        res.render("users", res);
    });

    //Signout 
    app.get("/logout", function (req, res) {
        if (req.user) {
            console.log("Goodbye user ", res);
            res.redirect("/");
        }
        else {
            res.redirect("/login");
        }
    });
};
