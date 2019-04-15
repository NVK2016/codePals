var bcrypt = require("bcryptjs")



//creating User model for users table
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("users", {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: ["^[a-z]+$", 'i']   //first name field will allow only letters
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: ["^[a-z]+$", 'i']   //last name field will allow only letters
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    photoLink: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'http://lorempixel.com/600/500/people'
    },
    passw: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3]
      }
    }
  });

  //method for the User Model
  User.generateHash = function (password) {
    return bcrypt.hashSync(password, 8)
  };

  User.prototype.compareHash = function (password) {
    return bcrypt.compareSync(password, this.passw)
  };


  User.associate = function (models) {
    User.belongsToMany(models.activities, {
      as: 'activities',
      through: 'usersActivities',
      foreignKey: 'userId'
    });
    User.belongsToMany(models.skills, {
      as: 'skills',
      through: 'usersSkills',
      foreignKey: 'userId'
    });
  };
  return User;
};
