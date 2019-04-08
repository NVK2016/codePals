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
            allowNull: false
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


    Activity.associate = function (models) {
        Activity.belongsToMany(models.users, {
            as: 'users',
            through: 'usersActivities',
            foreignKey: 'activityId'
        });
    };

    return Activity;
};





