var db = require("../models");
var passport = require('passport');

console.log("Activity Route file");

module.exports = function (app) {

    //Get all the open activities 
    app.get('/activity', function (req, res) {
        db.activities.findAll({ where: { active: '0' } }).then(function (dbActivities) {

            console.log(dbActivities);

            res.json(dbActivities)
        })
    });

    //we already have the dashboard route inside /api/user - how we should organize it?
    //Get Activity Data for the logged in user 
    app.get('/dashboard', function (req, res) {

        if (req.isAuthenticated()) {
            console.log(true)
            console.log(req.session.passport.user);
            var usId = req.session.passport.user.id;

            db.users.findOne({
                where: { id: usId },
                // where: { userid: req.userId },
                include: [{ model: db.activities, as: "activities" }, { model: db.skills, as: "skills" }]
            }).then(function (dbUser) {

                //Returns a JSON obj 
                res.json(dbUser);

            });



            //     db.Activities.findAll({
            //     where: { active: '0' },
            //     include: [{
            //         model: 'users',
            //         as: 'User',
            //         where: { userid: req.userId }
            //     }]
            // }).then(function (dbData) {

            //     console.log(dbData);

            //     res.json(dbData)
            // })

            // res.render("dashboard")
        } else {
            console.log("auth", req.isAuthenticated())
            res.redirect("/")
        }
    });


    //the get request for adding a new activity page
    app.get('/addactivity', function (req, res) {
        if (req.isAuthenticated()) {
            console.log("The user is authenticated");
            //console.log(req.session.passport.user);
            //var usId = req.session.passport.user.id;

            db.users.findAll({ where: { active: 1 } }).then(function (dbUsers) {
                console.log(dbUsers);
                var hbsObject = {
                    users: dbUsers
                };
                console.log(hbsObject);
                res.render("addactivity", hbsObject);
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
        //console.log(req.session.passport.user);
        //var usId = req.session.passport.user.id;
        //pass each activity via an id
        //this object will contain all the data we want
        var hbsCurrentUsers = {
            activityUsers: [],
            allUsers: []
        };

        db.activities.findAll({
            where: { id: id },
            include: [{ model: db.users, as: "users" }]
        }).then(function (dbActivity) {
            console.log("inside first promise");
            hbsCurrentUsers.activityUsers = dbActivity;

            db.users.findAll({
                //Dont include logged in user 
                where: {
                    active: 1
                } 
            }).then(function (dbUsers) {
                console.log("inside second promise");
                hbsCurrentUsers.allUsers = dbUsers;
                //SEND JSON TO TEST
                //res.json(hbsCurrentUsers);
                res.render("updactivity", hbsCurrentUsers);
                //populate the handlebars object with the current users for the current activity

            })               
             
            /* }
            else {
                //if the user is not authenticated, redirect him to the home page
                console.log("auth", req.isAuthenticated());
                res.redirect("/");
            } */
        });

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
                        .catch(function (err) {
                            console.log(err);
                            res.json(error);
                        });


                })
            }
            else {
                console.log("auth", req.isAuthenticated());
                res.redirect("/");
            }


        });

        //Updates the activity with the member values 
        app.put('/updactivity', function (req, res) {

        });

    };

