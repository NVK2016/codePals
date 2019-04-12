// ********************************************************************************* 
// user-api-routes.js - this file offers a set of routes for geting & sending user data to the various handlebars
// *********************************************************************************

// Dependencies
// =============================================================
var db = require("../models");

var Sequelize = require("sequelize"); 
const Op = Sequelize.op; 

var passport = require('passport');

console.log("User Route file");

//file has been exported as a function you can acess it by require('file-name.js')
module.exports = function (app) {

  //View All codePals in the database 
  app.get("/allpals", function (req, res) {

    //Passport Authentication is sucessfull then proceed further 
    if (req.isAuthenticated()) {
      console.log(true)
      console.log(req.session.passport.user);
      //Grabs the logged in user ID 
      var userId = req.session.passport.user.id;

      db.users.findAll({
        //Dont include logged in user 
        where: {
          [Op.not] : {id: userId} ,  active: 0}
      }).then(function (dbUsers) {
        var hbsObject = {
          users: dbUsers
        };
        console.log("All users", dbUsers);
        //res.json(dbUser);
        res.render("allpals", dbUsers);
      });
    } else {
      //Failed Auth then login again 
      console.log("auth", req.isAuthenticated())
      res.redirect("/login")
    }

  });

  //View All codePals in the database 
  app.get("/userSkills", function (req, res) {
    db.skills.findAll({}).then(function (dbSkills) {
     
      console.log("All skills", dbSkills);
      res.json(dbSkills);
      
    });
  });


  //Get data for the logged in user 
  app.get('/api/user', function (req, res) {
    console.log(db.activities);
    db.users.findOne({
      where: { id: req.params.id },
      include: [{ model: db.activities, as: "activities" }, { model: db.skills, as: "skills" }]
    }).then(function (dbUser) {
      res.json(dbUser);
    });
  });

  // FUNCTIONS
  // =============================================================

  //authentication function for both login and signup
  function passportAuthenticate(localStrategy, req, res, next) {
    // console.log(localStrategy, req.body, next)
    passport.authenticate(localStrategy, function (err, user, info) {
      if (err) {
        console.log("passport login/signup err", err)
        return next(err);
      }
      if (!user) {
        console.log("************", err, user, info)
        if (info.from === "signup") {
          return res.render('signup', info)
        }
        else if (info.from === "login") {
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


  // Register - create a new account 
  app.post('/signup', function (req, res, next) {
    // console.log("Req", req.body)
    passportAuthenticate("local-signup", req, res, next);
  });

  // Login - for an exisitng user 
  app.post('/login', (req, res, next) => {
    passportAuthenticate("local-signin", req, res, next);
  });

  //Edit My Profile - Retrives data for the authenticated logged in user 
  app.get('/upduser', function (req, res) {

    //Passport Authentication is sucessfull then proceed further 
    if (req.isAuthenticated()) {
      console.log(true)
      console.log(req.session.passport.user);
      //Grabs the logged in user ID 
      var userId = req.session.passport.user.id;

      //Grab data from users, usersSkills[internally] & skills for the logged in user 
      db.users.findAll({
        where: { id: userId },
        //Include user skills too 
        include: [{
          model: db.skills, as: "skills"
        }]
      }).then(function (dbUserInfo) {

        // console.log("Count of Skills : ", dbUserInfo[0].skills.length); 
        //the array will hold objects representing usersSkills table i.e. all the skills user has 
        var allSkills = [];

        //Loop through the corresponding skillSets for the logged in user
        for (var i = 0; i < dbUserInfo[0].skills.length; i++) {
          // console.log("skills ", i , " | ", dbUserInfo[0].skills[i].id, dbUserInfo[0].skills[i].skill);
          var skillSetObj = {
            id: dbUserInfo[0].skills[i].id,
            value: dbUserInfo[0].skills[i].skill
          };
          allSkills.push(skillSetObj);
        }

        var userInfo = {
          id: dbUserInfo[0].id,
          firstName: dbUserInfo[0].firstName,
          lastName: dbUserInfo[0].lastName,
          email: dbUserInfo[0].email,
          phone: dbUserInfo[0].phone,
          city: dbUserInfo[0].city,
          state: dbUserInfo[0].state,
          active: dbUserInfo[0].active,
          photoLink: dbUserInfo[0].photoLink,
          passw: dbUserInfo[0].passw,
          //Passing an array of skills to the handlebar 
          skills: allSkills
        }
        console.log("Display all the user Info", userInfo);
        //Returns a JSON obj 
        // res.json(dbUser);

        res.render("upduser", userInfo);

      });
    } else {
      //Failed Auth then login again 
      console.log("auth", req.isAuthenticated())
      res.redirect("/login")
    }
  });

  //Update My Profile - Updates the Logged in User Profile 
  app.put('/upduser', function (req, res) {

    //Prints out all the field value grab from the client side script 
    console.log("User Details: ", req.body);

    //Passport Authentication is sucessfull then proceed further 
    if (req.isAuthenticated()) {
      console.log(true)
      console.log(req.session.passport.user);
      //Grabs the logged in user ID 
      var userId = req.session.passport.user.id;

      console.log("User ID: ", userId , " | ", req.body);

      db.users.update({
        where: {
          UserId: userId
        }
      }).then(function (dbUser) {

        console.log("Update data" , dbUser);

        //Update Skills 

        res.json(dbUser)
        res.redirect("/dashboard");
      });
    } else {
      //Failed Auth then login again 
      console.log("auth", req.isAuthenticated())
      res.redirect("/login")
    }

    
  });

  //Inactive USer & the links projects associations 
  app.put('/deluser', function (req, res) {

  });

};