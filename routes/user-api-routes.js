var db = require("../models");
// var express = require("express");
// var app = express();

var passport = require('passport');


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
    console.log(db.activities);
    db.users.findOne({
      where: { id: 1 },
      include: [{ model: db.activities, as: "activities" }, { model: db.skills, as: "skills" }]
    }).then(function (dbUser) {
      res.json(dbUser);
    });
    //this part will be added later when we know how to identify a user
    /*db.users.findOne({
      where: { userid: req.userId },
      include: [{ model: db.activities, as: "activities" }, { model: db.skills, as: "skills" }]
    }).then(function (dbData) {

      console.log(dbData);

      res.json(dbData)
    }) */
  });

  //Registering 
  // app.post('/signup', function (req, res) {
  //   db.users.create({
  //     name: req.body.name
  //   }).then(function (userData) {

  //     console.log("Added new User Details" + userData)

  //     res.json(userData)
  //   }).catch(function (err) {
  //     console.log(err);
  //   });
  // });

//authentication function for both login and signup
  function passportAuthenticate(localStrategy, req, res, next) {
    // console.log(localStrategy, req.body, next)
    passport.authenticate(localStrategy, function (err, user, info) {
        if (err) {
            console.log("passport login/signup err", err)
            return next(err);
        }
        if (!user) {
            console.log("************",err, user, info)
            if (info.from === "signup") {
                return res.render('signup', info)
            }
            else if (info.from === "login"){
                return res.render("auth", info)
            }
        } else {
            console.log("passed ++++++++++++++++")
            req.login(user, function (err) {
                if (err) {
                    console.log(err)
                    return next(err);
                } else {
                    console.log("\n##########################");
                    console.log(req.isAuthenticated());
                    console.log('sucess');
                    console.log(req.session.passport.user.dataValues.id);
                    console.log("##########################");
                    console.log("\n")
                    return res.redirect("/dashboard");
                }


                //   return res.redirect('/users/' + user.username);
                // 
            });
        }

    })(req, res, next);
};


  // Register
  app.post('/signup', function (req, res, next) {
    // console.log("Req", req.body)
    passportAuthenticate("local-signup", req, res, next);
  });

// Login
app.post('/login', (req, res, next) => {
  passportAuthenticate("local-signin", req, res, next);
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