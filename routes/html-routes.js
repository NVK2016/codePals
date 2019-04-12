// ********************************************************************************* 
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

var db = require("../models");

// var passport = require('passport');


console.log("HTML Route file");

// Routes
// =============================================================
module.exports = function (app) {

    //Splash page 
    app.get("/", function (req, res) {
        console.log("Splash page ", res);
        res.render("index");
    });

    //Welcome page 
    app.get("/welcome", function (req, res) {
        console.log("Welcome page ", res);
        res.render("login");
    });

    //Login page 
    app.get("/login", function (req, res) {
        console.log("Welcome exisiting user logging into system", res);
        //Render the index handle bar 
        res.render("auth", res);
    });

    //Sigin Up page 
    app.get("/signup", function (req, res) {


        console.log("HTML get singup url ");
        //Render the index handle bar 
        res.render("signup", res);
    });

  /*   //New Activity Form 
    app.get("/addactivity", function (_req, res) {
        console.log("Creating a new Activity", res);
        //Render the dashboard html 
        res.render("createActivity", res);
    }); */

    //Making it secure while transferrign data from client-side to server 
    // app.get("/dashboard", function (req, res) {
    //     console.log("Navigate to dashboard");
    //     //Render the dashboard html 
    //     res.render("dashboard", res);
    // });

    // //View All Members in the site 
    // app.get("/allpals", function (req, res) {
    //     console.log("Display all members and their skills");
    //     //Render the dashboard html 
    //     res.render("users", res);
    // });

    //Signout 
    app.get("/logout", function (req, res) {
        // if (req.user) {
        //     console.log("Goodbye user " );
        //     res.redirect("/");
        // }
        // else {
        //     res.redirect("/login");
        // }

        res.clearCookie("user_sid");
        req.session.destroy(function(err) {
            req.logout();
            res.clearCookie("user_sid");
            res.status(200).redirect("/");
        });

    });

    // // If no matching route is found default to welcome page 
    // app.get("*", function(req, res) {
    //     res.redirect("/"); 
    // });
};