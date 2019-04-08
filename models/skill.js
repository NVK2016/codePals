//creating Skill model for skills table
module.exports = function (sequelize, DataTypes) {
    var Skill = sequelize.define("skills", {
        skillType: {
            type: DataTypes.STRING,
            allowNull: true           
        },
        skill: {
            type: DataTypes.STRING,
            allowNull: false           
        } 
    });

    Skill.associate = function (models) {
        Skill.belongsToMany(models.users, {
            as: 'users',
            through: 'usersSkills',
            foreignKey: 'skillId'
        });
    };
    return Skill;
};
