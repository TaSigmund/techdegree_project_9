/***
 * USER ROUTES
 ***/

/***
 * Modules/Dependencies
 ***/
const express = require('express');
const router = express.Router();
const {authenticateUser} = require('../auth-user');
const {User} = require('../models');
const bcrypt = require('bcryptjs');

/***
 * Handler function for routes to avoid repeating try/catch blocks
 ***/

function asyncHandler(cb){
    return async(req, res, next) => {
        try {
            await cb(req, res, next)
        } catch(error){
            if (error.name === 'SequelizeUniqueConstraintError' || error.name === 'SequelizeValidationError'){//makes sure there is only one account per e-mail address and validation is met
                error.status = 400;
                const errors = error.errors.map(err => err.message); //iterates over the errors property of the validation/constraint error
                console.log(errors);
            }
            next(error) //passes error to global error handler
        }
    }
}

/***
 * return the currently authenticated user
 ***/

router.get('/', authenticateUser, (req, res, next)=>{
    let relevantUserInformation = {
        id: req.currentUser.id, //req.currentUser as defined in the authentication middleware
        firstName: req.currentUser.firstName,
        lastName: req.currentUser.lastName,
        emailAddress: req.currentUser.emailAddress
    }
    res.status(200).json(relevantUserInformation).end()
});

/***
 * create a new user
 ***/
router.post('/', asyncHandler(async(req, res, next)=>{
        if (req.body.password){
            if (req.body.password.length >= 8 && req.body.password.length <= 20){
                //hash password
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(req.body.password, salt);
                req.body.password = hash;

                //create user
                const createUser = await User.create(req.body);

                //send response
                res.status(201).location('/').end();
                }
            else {
                res.status(400).json({error: 'Your password should be between 8 and 20 letters long.'})
            }
        }
        else {
            //not really to create a user but to trigger validation on all
            const createUser = await User.create(req.body);
        }
    }));

module.exports = router;