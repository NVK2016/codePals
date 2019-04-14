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

    //Welcome page 
    app.get("/", function (req, res) {
        // console.log("Welcome page ", res);
        res.render("index");
    });

    //Login page 
    app.get("/login", function (req, res) {
        // console.log("Welcome exisiting user logging into system", res);
        //Render the index handle bar 
        res.render("auth", res);
    });

    //Sigin Up page 
    app.get("/signup", function (req, res) {


        console.log("HTML get singup url ");
        //Render the index handle bar 
        res.render("signup", res);
    });

  
    //Signout Page
    app.get("/logout", function (req, res) {
       
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