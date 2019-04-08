//a UserSkill model for cross-reference usersSkills table
module.exports = function (sequelize, DataTypes) {
    var UserSkill = sequelize.define('usersSkills', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        skillId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'skills',
                key: 'id'
            }
        },
        hasSkill: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return UserSkill;
};
