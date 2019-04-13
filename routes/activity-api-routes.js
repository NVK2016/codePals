var db = require("../models");
var passport = require('passport');

console.log("Activity Route file");

//we will use sequelize operators Op such as notIn for filtering
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = function (app) {

    //Get all the open activities 
    app.get('/activity', function (req, res) {
        db.activities.findAll({ where: { active: '0' } }).then(function (dbActivities) {

            console.log(dbActivities);

            res.json(dbActivities)
        })
    });

    //Get Activity Data for the logged in user 
    app.get('/dashboard', function (req, res) {

        if (req.isAuthenticated()) {
            // console.log(true)
            // console.log(req.session.passport.user);
            var usId = req.session.passport.user.id;

            db.activities.findAll({
                where: {
                    active: 1,
                    actType: "meetup"
                }
            }).then(function (allActivity) {
                // console.log("All Activities: ", allActivity)

                var allActArr = [];
                for (var i = 0; i < allActivity.length; i++) {
                    allActArr.push(allActivity[i].dataValues)
                    allActArr[i].isMine = (allActivity[i].dataValues.adminId === usId)
                };

                db.users.findOne({
                    where: { id: usId },
                    include: [{ model: db.activities, as: "activities" }]
                }).then(function (dbUser) {

                    // //Returns a JSON obj 
                    // res.json(dbUser);

                    var user = dbUser.dataValues

                    var activities = [];
                    for (var i = 0; i < user.activities.length; i++) {
                        if (user.activities[i].dataValues.actType === 'project') {
                            activities.push(user.activities[i].dataValues);
                            activities[i].isMine = (user.activities[i].dataValues.adminId === user.id)
                        };
                    };

                    var userInfo = {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone,
                        city: user.city,
                        state: user.state,
                        active: user.active,
                        photoLink: user.photoLink,
                        myActivities: activities,
                        allActivities: allActArr
                    };

                    // console.log(activities[0])
                    res.render("dashboard", userInfo)

                });
            });
        } else {
            console.log("auth", req.isAuthenticated())
            res.redirect("/")
        };
    });


    //The get request for adding a new activity page - it will render addactivity.handlebars page
    app.get('/addactivity', function (req, res) {
        if (req.isAuthenticated()) {
            console.log("The user is authenticated"); //we authenticated the user

            //we will select all active current users to populate drop-down menu in our addactivity form
            db.users.findAll({ where: { active: 1 } }).then(function (dbUsers) {
                //console.log(dbUsers);
                var hbsObject = {
                    users: dbUsers
                };
                res.render("addactivity", hbsObject); //render the form
            })
        }
        else {
            //if the user is not authenticated, redirect him to the home page
            console.log("auth", req.isAuthenticated());
            res.redirect("/");
        }
    });



    //the get request for adding a new activity page
    app.get('/updactivity/:id', function (req, res) {
        /*  if (req.isAuthenticated()) { */
        console.log("The user is authenticated");
        var id = req.params.id;
        //pass each activity via an id
        //this object will contain all the data we want to display on update activity page
        //we will create one big object containg two arrays of objects:
        //first includes all the activity data plus all participating users, and another 
        //includes the users who was not invited yet
        var addedUsers = [];
        var hbsCurrentUsers = {
            activityUsers: [],
            allUsers: []
        };

        //in the first call we want to get the activity with the corresponding id 
        //and all the users participating in the activity
        db.activities.findAll({
            where: { id: id },
            include: [{ model: db.users, as: "users" }]
        }).then(function (dbActivity) {

            //we constract the first part of the complex object 
            hbsCurrentUsers.activityUsers = dbActivity;

            //this array will be used below to filter the users who were not invited
            //using notIN clause of sequelize ORM 
            var addedUsers = dbActivity[0].users;
            var addeduserIds = [];  //the array contains ids of the invited users
            for (var i = 0; i < addedUsers.length; i++) {
                addeduserIds.push(addedUsers[i].id);
            }

            //filtering out the user already were invited
            db.users.findAll({
                where: {
                    id: { [Op.notIn]: addeduserIds }
                }
            }).then(function (dbUsers) {
                //var all = dbUsers;

                hbsCurrentUsers.allUsers = dbUsers;
                //res.json(hbsCurrentUsers);  //this line was used for testing
                //render update activity page and send the object containg two arrays of objects:
                //first including all the activity data and all participationg users, and another 
                //to include all the users who were not invited
                res.render("updactivity", hbsCurrentUsers);
            })

            /* }
            else {
                //if the user is not authenticated, redirect him to the home page
                console.log("auth", req.isAuthenticated());
                res.redirect("/");
            } */
        });




        //Add a new Project / Meetup  
        app.post('/addactivity', function (req, res) {

            if (req.isAuthenticated()) {
                console.log("The user is authenticated");
                console.log(req.session.passport.user);
                var usId = req.session.passport.user.id;

                console.log(req.body.activity);
                var obj = JSON.parse(req.body.activity); //getting an object from json 
                console.log(obj);
                //var leaderId = passedActivity.adminId;   //will use if passport works!!!!!!
                var leaderId = usId; // will have to grab it from req
                //pass new values to the activities table model to create a new record
                //in the activities table and in the same transaction to add multiple records to the join usersActivities table

                var arrayIds = obj["participantsIds"];
                //hardcoding adminId until passport is working

                console.log('Creating a new activity!');
                db.activities.create({
                    adminId: leaderId,
                    title: obj.title,
                    description: obj.description,
                    location: obj.location,
                    estimateStartDate: obj.estimateStartDate,
                    actType: obj.actType,
                    active: true,
                }).then(function (dbActivity) {
                    //the array will hold objects representing usersActivities table
                    var allInvited = [];

                    //create the corresponding usersActivities objects based on the ids in the arrayIds
                    for (var i = 0; i < arrayIds.length; i++) {
                        var inviteeObj = {
                            userId: parseInt(arrayIds[i]),
                            activityId: dbActivity.dataValues.id,
                            interested: false
                        };
                        allInvited.push(inviteeObj);
                    }

                    //create the usersActivities object for the admin and push it to the array
                    var adminObj = {
                        userId: leaderId,
                        activityId: dbActivity.dataValues.id,
                        interested: true
                    };
                    allInvited.push(adminObj);

                    //insert multiple records from the array to the usersActivities table
                    db.usersActivities.bulkCreate(allInvited, {
                        returning: true
                    }).then(function (dbUsersActivities) {
                        console.log("Activity added " + dbUsersActivities.dataValues);
                        res.json(dbUsersActivities);
                        //will have to redirect to a dashboard for the user
                    })
<<<<<<< HEAD
                        .catch(function (err) {
                            console.log(err);
                            res.json(error);
                        });
=======


>>>>>>> bff24e21070aa35e533136fac610dd1ee5dba674
                })
            }
            else {
                console.log("auth", req.isAuthenticated());
                res.redirect("/");
            }


        });


        app.put("/updateinterest", function (req, res) {
            db.usersActivities.update(
                {
                    interested: req.body.interested
                }, {
                    where: {
                        userId: req.session.passport.user.id,
                        activityId: req.body.activityId
                    }
                }).then(function (data) {
                    res.redirect("/dashboard")
                })
        })

        //Updates the activity with the member values 
        app.put('/updactivity', function (req, res) {

        });

    };

