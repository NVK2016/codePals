var db = require("../models");

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
        db.Activities.findAll({
            where: { active: '0' },
            include: [{
                model: 'users',
                as: 'User',
                where: { userid: req.userId }
            }]
        }).then(function (dbData) {

            console.log(dbData);

            res.json(dbData)

        })
    });

    //the get request for adding a new activity page
    app.get('/addactivity', function (req, res) {
        db.users.findAll({ where: { active: 1 } }).then(function (dbUsers) {
            console.log(dbUsers);
            var hbsObject = {
                users: dbUsers
            };
            console.log(hbsObject);
            res.render("addactivity", hbsObject);
        })
    });


    //Add a new Project / Meetup  
    app.post('/addactivity', function (req, res) {
        //we have to receive in req.body an array of userids selected by an admin:

        //try to retrieve the values from the req
        
        //hardcoding values for now:
        var arrayIds = [3, 4];
        var leaderId = 1; // will have to grab it from req
        console.log('creating a new activity!')
        // console.log(req.body)
        db.activities.create({
            /*  name: req.body.name,  //we will have to read from req.body.title, etc 
             description: req.body.description, etc*/
            adminId: leaderId,
            title: "Project Number 10",
            description: "Useful full stack web app",
            location: "San Francisco",
            estimateStartDate: "July 2019",
            actType: "project",
            active: true,
        }).then(function (dbActivity) {
            console.log("Activity : " + dbActivity);
            //the array will hold objects representing usersActivities table
            var allInvited = [];

            //create the corresponding usersActivities objects based on the ids in the arrayIds
            for (var i = 0; i < arrayIds.length; i++) {
                var inviteeObj = {
                    userId: arrayIds[i],
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
        });

        //Updates the activity with the member values 
        app.put('/updactivity', function (req, res) {

        });

    });

}