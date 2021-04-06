'use strict';
const {Model, DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A first name is required."
                },
                notEmpty: {
                    msg: "A first name is required."
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A last name is required."
                },
                notEmpty: {
                    msg: "A first name is required."
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "There is already an account associated with your e-mail address."
            },
            validate: {
                notNull: {
                    msg: "An e-mail address is required."
                },
                notEmpty: {
                    msg: "A first name is required."
                },
                isEmail: {
                    msg: "Please enter a valid e-mail address."
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A password is required."
                },
                notEmpty: {
                    msg: "A password is required."
                }
            }
        } 
}, { sequelize });

User.associate = models => {
    User.hasMany(models.Course, {foreignKey:{
        fieldname: 'userId',
        allowNull: false,
    }});
};

  return User;
};