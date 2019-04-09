var db = require("../models");
// var express = require("express");
// var app = express();

console.log("User Route file"); 

//file has been exported as a function you can acess it by require('file-name.js')
module.exports = function (app) {
  
  //Sends all users 
  app.get("/users", function (req, res) {
    db.users.findAll({}).then(function (dbUser) {
        var hbsObject = {
            users: dbUser
        };
        //res.json(dbUser);
        res.render("users", hbsObject);
    });
  });

  //Get data for the logged in user 
  app.get('/api/user', function (req, res) {
    db.users.findOne({
      where: { userid: req.userId },
      include: [{ model: db.activities, as: "activities" }, { model: db.skills, as: "skills" }]
    }).then(function (dbData) {

      console.log(dbData);

      res.json(dbData)
    })
  });

  //Registering 
  app.post('/signup', function (req, res) {
    db.users.create({
      name: req.body.name
    }).then(function (userData) {

      console.log("Added new User Details" + userData)

      res.json(userData)
    }).catch(function (err) {
      console.log(err);
    });
  });

  //Updates the user Profile 
  app.put('/upduser', function (req, res) {
    if (req.user) {

      db.users.update({
        where: {
          UserId: req.userid
        }
      }).then(function (dbUser) {
        console.log(dbUser);
        res.json(dbUser)
      });
    }
    else {
      res.redirect("/login")
    };
  });

  //Inactive USer & the links projects associations 
  app.put('/deluser', function (req, res) {
    
  });

};