const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/key');
const passport = require('passport');

const validateRegister = require('../../../validation/AdminValidation/register');
const validateLogin = require('../../../validation/AdminValidation/login');


//Load User models
const Admin = require('../../../models/Admin');


// @route GET api/users/test
// @desc Tests user route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'User works'}));


//@route GET api/users/register
//@desc Register User
//@access Public

router.post('/register', (req, res) => {

    const { errors, isValid } = validateRegister(req.body);

//    Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Admin.findOne({username: req.body.username})
        .then(admin => {
            if (admin) {
                errors.message = 'Admin already exists';

                return res.status(400).json(errors);
            } else {
                const newAdmin = new Admin({
                    username: req.body.username,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                   bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                       if (err) throw err;

                       newAdmin.password = hash;
                       newAdmin.save()
                           .then(admin => res.json({admin}))
                           .catch(err => console.log(err))
                   })
                });
            }
        })

});

//@route GET api/admin/login
//@desc Login Admin /REturning the JWT Token
//@access Public
router.post('/login', (req, res) => {

    const { errors, isValid } = validateLogin(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const username = req.body.username;
    const password = req.body.password;

    Admin.findOne({ username: username})
        .then(admin => {
            if (!admin) {
                errors.username = 'Wrong Username Or Password';
                return res.status(404).json(errors)
            }

            bcrypt.compare(password, admin.password).then(isMatch => {
                if (isMatch) {
                    //Create JWT Payload
                    const payload = {
                        id: admin.id,
                        user: 'Admin',
                        username: admin.username
                    };

                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        { expiresIn: '24h' },
                        (err, token) => {
                            res.json({
                                // payload,
                                success: true,
                                adminToken: 'Bearer ' + token + ' Admin'
                            })
                        });
                } else {
                    errors.password = 'Password is incorrect';
                    return res.status(400).json(errors)
                }
            })
        })

});


module.exports = router;
