//var bcrypt = require("bcryptjs");

//creating Activity model for activities table
module.exports = function (sequelize, DataTypes) {
    var Activity = sequelize.define("activities", {
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        estimateStartDate: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        actType: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['project', 'meetup']]
            }
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    });

 /*    //method for the User Model
    Activity.generateHash = function (password) {
        return bcrypt.hashSync(password, 8)
    };

    Activity.prototype.compareHash = function (password) {
        return bcrypt.compareSync(password, this.passw)
    }; */


    Activity.associate = function (models) {
        Activity.belongsToMany(models.users, {
            as: 'users',
            through: 'usersActivities',
            foreignKey: 'activityId'
        });
    };

    return Activity;
};





