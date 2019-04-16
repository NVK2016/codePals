# codePals
## <a name="introduction"> Introduction </a>
<hr />
Fullstack Appplication Node server Express &amp; mysql. 
This application will help coonnect people with want to come together to create a usable software , endless possibilties to create an amazing network of people around. 

This app is one spot hub to share information related to tech meetups for codePlas to broswer through the events and slect if they are interested or not. 

-- Screenshot of the App Page  

## Table of Content
+ [Introduction](#introduction)
+ [Getting Started](#gettingstarted)
+ [Built With](#builtWith)
+ [App Features](#features)
+ [DB Architecture](#dbarchiterture)
+ [DB EER Diagram](#errDB)
+ [Using bulkCreate](#bulkcreate)
+ [Authentication](#authentication)
+ [Using Handlebars Helper Functions](#helpers)
+ [Update Activity Form](#updactivity)
+ [CRU Profile & Skills](#updProfile)
+ [View Pals](#viewallpals)

## <a name="gettingstarted"> Getting Started </a>
<hr/>
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

What things you need installed before running this application.

+ [Node](https://nodejs.org/en/download/)
+ [npm](https://docs.npmjs.com/cli/install)
+ [MySQL](https://dev.mysql.com/downloads/windows/installer/8.0.html)

```
    npm install 

    install dependencies that are located in package.json

    "dependencies": {
        "bcryptjs": "^2.4.3",
        "body-parser": "^1.18.3",
        "express": "^4.16.4",
        "express-handlebars": "^3.0.2",
        "express-session": "^1.16.1",
        "mysql2": "^1.6.5",
        "passport": "^0.4.0",
        "passport-local": "^1.0.0",
        "sequelize": "^5.3.0"
    }
```


## Demo Link 
<hr /> 

## <a name="builtWith"> Built With </a>
1. Node Packages 
    * Express - Node.js web application framework
     * Express Handlebars 
     * Passport - authentication for Node.js
     * Sequelize - promise-based ORM for Node.js
     * MySQL - to store all our records.
     * bcrypt - Encrypt password when save in database.
    
 2. HTML
    * CSS - custom css style 
    * Bootstrap  The CSS framework used.
    * Chosen Jquery Plugin - makes long, unwieldy select boxes much more user-friendly along with its multi-select options. 
    * Sketch - to design wireframes. 
    * Illustrator - to design the awesome logo. 



## <a name="features"> Features </a> 
<hr/> 

1.  
2. 

#### <a name="dbarchiterture"> DB architecture </a>

Our database architecture has 3 main tables to hold users, activities and skills, with users and activities and users and skills having many-to many relationships, since a user can have many activities and one activity can have many participating users, and each user can have many skills, and one skill can belong to many users. For each inserted activity into the activities table we had to insert multiple records into the join usersActivities table (one activity associated with each participating user) using Sequelize bulkCreate() inside nested calls to the database.
The code snippet below shows how to add multiple associations to a model:

![DB models many-to-many](./public/assets/img/many-to-many.png)
<hr/> 

#### <a name="errDB">EER Diagram </a>

The diagram belows gives you a better idea how the relationships are created. One to Many & how Many to MAny is established.

![ERR Diagram](./public/assets/img/EERDiagram_codePals.png)

<hr/>

#### <a name="bulkcreate"> Using bulkCreate() in nested db calls </a>

The code snippet below demonstrates usage of bulkCreate() in the nested database calls. As a first step, we created an activity record inside the Activity table, passing the values taken from our CreateActivity form. Then inside the promise we used the data passed back to the callback function, retrieved  the new activity id returned by Sequelize and used it to create an array of multiple objects representing the usersActivities join table, which we passed into the bulkCreate() to insert multiple userActivity objects.

![bulkCreate](./public/assets/img/bulkCreate.png)
<hr/> 


## <a name="authentication"> Authentication </a>
+ Signup and Login 
    + signup and login are done through local-strategy authentication provided by passport.js which uses some form of username (we customized to email) and password to authenticate user.
    + Once authenticated, user can access other feature of the application.
    + Information unique to the user that are stored in the database can be retrieved once users log in  
    + users' passwords that are stored in the are encrypted with bcryptejs authentication process also use bcrypte to decrypte password for comparison user input of password and encrypted password stored in our database

The codes below is used to create a new strategy for signup for an account that can be use for authentication of session. It takes in the email information from our database as the username field and the passw for the password field. First thing this strategy does is that it will do a query in our database to check if user's email is already registered. If it is, it will throw a custome error. If it is not, the function will run a query to create a new data set with all the user information that the user has input in the front-end form. 

*The log in strategy code is very similar to this.

```
passport.use("local-signup", new LocalStrategy({
    usernameField: "email",
    passwordField: "passw",
    passReqToCallback: true 
  },

    function (req, email, passw, done) {
      process.nextTick(function () {
        db.users.findOne({
          where: {
            email: email
          }
        }).then(function (user, err) {
          console.log("Hi User", user)
          
          if (user) {
            return done(null, false, { 
              from: "signup",
              message: 'This email is already registered.' 
            });
          } else {
            db.users.create({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: email,
              phone: req.body.phone,
              city: req.body.city,
              state: req.body.state,
              passw: db.users.generateHash(passw)
            }).then(function (newUser) {
              return done(null, newUser)
            }).catch(err => console.log(err))
          }
        })
      })

    })) 
```

<hr/> 

#### <a name="helpers"> Using Handlebars helper functions </a>

We used handlebars helper functions for our Update Activity form radio buttons to show the current activity selection between Project and Meetup. Since the database returns either “project” or “meetup” string for a type of activity, we had to create simple helper functions which return “checked” if the passed string was “project” for a project type (as well as "meetup" if it is current activity type). The functions were registered as helper functions inside our server.js, and then called from the radio buttons tags when setting their checked property.

The helper functions were registered first:

![Handlebars helper reg](./public/assets/img/handlebar-helpers-regis.png)

and used inside the handlebars templete to set selection for the activity type: 

![Handlebars helper reg](./public/assets/img/hnd-helpers-use.png)

<hr/> 

#### <a name="updactivity"> UpdateActivity Form </a>

Below is an example of our GET method for the UpdateActivity form. We made nested calls to the database to prepopulate the form. In the first call, we selected the corresponding activity data from the activity table and all users participating in the activity. Then in the second call we selected from the database the users who were not participating in the activity, and added their names to the drop-down control at the bottom so they can be invited to the activity.

![UpdateActivity Form](./public/assets/img/upd-activity-form.png)

<hr/> 

#### <a name="updProfile"> CRU Profile & Skill </a>

What **CRU** ?? 

This is where it all happens in one place **YES CRU** guy :) 

1. **_Create Record_**  : **PUT** METHOD is called to populate all the user information. 
2. **_Retrieve Record_** : **GET** METHOD is called to populate all the user information. 
3. **_Update Record_** : 

![UpdateActivity Form](./public/assets/img/upd-activity-form.png)

<hr/> 

#### <a name="viewallPals"> View all codePals </a>


![UpdateActivity Form](./public/assets/img/upd-activity-form.png)

<hr/> 


### Contributors: 
* Samuel Yu
* Halina Zmachynskaya
* Namita Shenai 
* Shayan Anoushiravani
* Nadire Ghalip









