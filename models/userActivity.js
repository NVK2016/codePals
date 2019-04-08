
module.exports = function (sequelize, DataTypes) {
    var UserActivities = sequelize.define('usersActivities', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        activityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'activities',
                key: 'id'
            }
        },
        interested: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return UserActivities;
};


