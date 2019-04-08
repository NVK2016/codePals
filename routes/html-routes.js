// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
//var path = require("path");
var db = require("../models");


// Routes
// =============================================================
module.exports = function (app) {
   
    //users route to see active /non-active users
    app.get("/users", function (req, res) {
        db.users.findAll({}).then(function (dbUser) {
            var hbsObject = {
                users: dbUser
            };
            //res.json(dbUser);
            res.render("users", hbsObject);
        });
    });
};
