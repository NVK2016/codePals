// ********************************************************************************* 
// user-api-routes.js - this file offers a set of routes for geting & sending user data to the various handlebars
//CRU - Create, Read & Update  DATA FOR USERS & SKILLS TABLE 
// *********************************************************************************

// Dependencies
// =============================================================
var db = require("../models");

//Using it to access the Sequelize in built operators to conditionally show data 
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//requiring passport for authentication purpose 
var passport = require('passport');

console.log("User Route file");

//file has been exported as a function you can acess it by require('file-name.js')
module.exports = function (app) {

  // Dashboard Route - Get Information for the Looged in User 
    // app.get("/dashboard", function (req, res) {
    //     console.log("Navigate to dashboard");
    //     //Render the dashboard html 
    //     if (req.isAuthenticated()) {
    //       console.log(true)
    //       console.log(req.session.passport.user);
    //       var usId = req.session.passport.user.id;

    //       db.users.findOne({
    //           where: { id: usId },
    //           include: [{ model: db.activities, as: "activities" }, { model: db.skills, as: "skills" }]
    //       }).then(function (dbUser) {

    //           //Returns a JSON obj and redirects to dashboard 
    //           res.render("dashboard", dbUser);

    //       });
    //   } else {
    //       console.log("auth", req.isAuthenticated())
    //       res.redirect("/login")
    //   }
    // });


  //View All codePals in the database 
  app.get("/allpals", function (req, res) {

    //Passport Authentication is sucessfull then proceed further 
    if (req.isAuthenticated()) {
      console.log(true)
      console.log(req.session.passport.user);
      //Grabs the logged in user ID 
      var userId = req.session.passport.user.id;

      db.users.findAll({
        //Excluded the logged in user only activee members 
        where: {
            active: 1 , 
            //using the not operator of sequlize i.e example: userid NOT "1"
            [Op.not] : [{id: userId}]
          },
          //Include user skills too for all th members 
        include: [{
          model: db.skills, as: "skills"
        }] ,
      }).then(function (dbUsers) {
        var hbsObject = {
          users: dbUsers
        };
        console.log("Each user ", dbUsers.length);
        // console.log("Each user Skill", dbUsers.skills.length);
        //Returns the JSON OBJECT that holds data related to all users within each user an array of skills user has 
        res.render("allpals", hbsObject);
      });
    } else {
      //Failed Auth then login again 
      console.log("auth", req.isAuthenticated())
      res.redirect("/login")
    }

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
      var allSkills = []; 

      //Populate ALL Skills in the database in the Drop Down List 
      db.skills.findAll({}).then(function (dbSkills) {
     
        console.log("All skills count", dbSkills.length);
        
        //Loop through the all skillset in the database 
        for (var i = 0; i < dbSkills.length; i++) {
          // console.log("Skill ", i , " | ",dbSkills[i].id, dbSkills[i].skill, dbSkills [i].skillType );
          var skillSetObj = {
            id: dbSkills[i].id,
            value: dbSkills[i].skill
          };
          allSkills.push(skillSetObj);
        }
        
      });
      // console.log("\n All skills in the database ", allSkills.length , "\n "); 

      //Grab data from users, usersSkills[internally] & exisiting skills for the Logged in user 
      db.users.findAll({
        where: { id: userId },
        //Include user skills too 
        include: [{
          model: db.skills, as: "skills"
        }]
      }).then(function (dbUserInfo) {

        // console.log("Count of Skills : ", dbUserInfo[0].skills.length); 
        //the array will hold objects representing usersSkills table i.e. all the skills user has 
        var alluserSkills = [];

        //Loop through the corresponding skillSets for the logged in user
        for (var i = 0; i < dbUserInfo[0].skills.length; i++) {
          // console.log("skills ", i , " | ", dbUserInfo[0].skills[i].id, dbUserInfo[0].skills[i].skill);
          var skillSetObj = {
            id: dbUserInfo[0].skills[i].id,
            value: dbUserInfo[0].skills[i].skill
          };
          alluserSkills.push(skillSetObj);
        }
        //This USER OBJECT returns data related to the user, their skills 
        //& shows all skills in DB to populate the drop-down list 
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
          //Passing an array of userskills to the handlebar 
          userSkills: alluserSkills,
          //Passing the arrays of All skills in the database 
          skills: allSkills
        }
        console.log("Display all the user Info", userInfo);

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

    //Passport Authentication is sucessfull then proceed further 
    if (req.isAuthenticated()) {
      //Prints out all the field value grab from the client side script 
      console.log("User Details: ", req.body);

      console.log(true)
      console.log(req.session.passport.user);
      //Grabs the logged in user ID 
      var userId = req.session.passport.user.id;

      console.log("\n User ID: ", userId , " | ", req.body);

      db.users.update(
        //Fields to update 
        req.body
      , {
        where: {
          id: userId
        }
      }).then(function (dbUser) {

        console.log("Update data" , dbUser);

        res.render("/upduser", dbUser)
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

  //Adding a New skill into the database along with userSkill 
  app.post('/addskill', function (req, res) {


    // create takes an argument of an object describing the item we want to
    // insert into our table. In this case we just we pass in an object with a text
    // and complete property (req.body)
    console.log(req.body);

    //Passport Authentication is sucessfull then proceed further 
    if (req.isAuthenticated()) {
      //Prints out all the field value grab from the client side script 
      console.log("Details: ", req.body);

      console.log(true)
      console.log(req.session.passport.user);
      //Grabs the logged in user ID 
      var userId = req.session.passport.user.id;

      //INSERT INTO skill TABLE 
      db.skills.create({
        skill: req.body.skill,
        skillType: req.body.skillType
      }).then(function (dbSkill) {
        console.log(dbSkill);
        //INSERT INTO cross-reference tablee the same into userSkill Table for the logged in user 
        db.usersSkills.create({
          userId: userId,
          skillId: dbSkill.id,
          hasSkill: true
        }).then(function (dbuserSkill) {
          console.log("userskill details", dbuserSkill); 

        });
        // We have access to the new todo as an argument inside of the callback function
        // res.json(dbSkill);
      });
    } else {
      //Failed Auth then login again 
      console.log("auth", req.isAuthenticated())
      res.redirect("/login")
    }
  });

};