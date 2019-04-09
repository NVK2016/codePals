var db = require("../models");

console.log("Activity Route file"); 

module.exports = function (app) {
    
    //Get all the open activities 
    app.get('/activity', function (req, res) {
        db.activities.findAll({ where : {active : '0'}}).then(function (dbActivities) {

            console.log(dbActivities);

            res.json(dbActivities)
        })
    });

    //Get Activity Data for the logged in user 
    app.get('/dashboard', function (req, res) {
        db.Activities.findAll({ where:{active : '0'},
        include: [{
            model : 'users' , 
            as : 'User' , 
            where : {userid: req.userId } }]
         }).then(function (dbData) {

            console.log(dbData);

            res.json(dbData)
        })
    });

    //Add a new Project / Meetup  
    app.post('/addactivity', function (req, res) {
        db.activities.create({
            name: req.body.name
        }).then(function (actData) {
            console.log("Activity Details" + actData)
            res.json(actData)
        }).catch(function (err) {
            console.log(err);
        });
    });

    //Updates the activity with the member values 
    app.put('/updactivity', function (req, res) {
        
    });

};