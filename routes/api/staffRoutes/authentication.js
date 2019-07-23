const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/key');
const passport = require('passport');

const validateProfile = require('../../../validation/StaffValidation/profile');
const validateUpdateStaff = require('../../../validation/StaffValidation/updateStaff');
const validateChangePassword = require('../../../validation/StaffValidation/password');


//Load User models
const Staff = require('../../../models/Staff');


// @route GET api/users/test
// @desc Tests user route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'User works'}));


//@route GET
//@desc Login Staff
//@access Public

router.post('/login', (req, res) => {

    const { errors, isValid } = validateProfile(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const username = req.body.username;
    const password = req.body.password;

    Staff.findOne({ username: username})
        .then(staff => {
            if (!staff) {
                errors.username = 'Wrong Email Or Password';
                return res.status(404).json(errors)
            }

            bcrypt.compare(password, staff.password).then(isMatch => {
                if (isMatch) {
                    //Create JWT Payload
                    const payload = {
                        id: staff.id,
                        user: 'Staff',
                        username: staff.username,
                        firstName: staff.firstName,
                        lastName: staff.lastName
                    };

                    jwt.sign(payload, keys.secretOrKey, { expiresIn: '24h' },
                        (err, token) => {
                            res.json({
                                // payload,
                                success: true,
                                staffToken: 'Bearer ' + token + ' Staff'
                            })
                        });
                } else {
                    errors.password = 'Password is incorrect';
                    return res.status(400).json(errors)
                }
            })
        })

});


//@route POST
//@desc Edit the profile of the staff
//@access Private

router.post('/editProfile/:id',  passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateUpdateStaff(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const staffFields = {};

    if (req.body.firstName) staffFields.firstName = req.body.firstName;
    if (req.body.lastName) staffFields.lastName = req.body.lastName;
    if (req.body.username) staffFields.username = req.body.username;

    Staff.findById(req.params.id)
        .then(staff => {
            if (staff) {
                // bcrypt.genSalt(10, (err, salt) => {
                //     bcrypt.hash(staffFields.password, salt, (err, hash) => {
                //         if (err) throw err;

                        // staffFields.password = hash;


                        Staff.findOneAndUpdate(
                            {_id: req.params.id},
                            {$set: staffFields},
                            {new: true}
                        )
                            .then(staff => res.json(staff));
                    // })
                // });

            } else {
                errors.password = 'Staff does not exist';
                return res.status(400).json(errors)
            }
        });

});


//@route POST
//@desc Edit the profile of the staff
//@access Private

router.post('/changePassword/:id',  passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateChangePassword(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const staffFields = {};

    if (req.body.password1) staffFields.password1 = req.body.password1;
    if (req.body.password) staffFields.password = req.body.password;

    Staff.findOne({ _id: req.params.id })
        .then(staff => {
            if (staff) {

                bcrypt.compare(staffFields.password1, staff.password).then(isMatch => {
                    if (isMatch) {
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(staffFields.password, salt, (err, hash) => {
                                if (err) throw err;

                                staffFields.password = hash;


                                Staff.findOneAndUpdate(
                                    {_id: req.params.id},
                                    {$set: staffFields},
                                    {new: true}
                                )
                                    .then(staff => res.json(staff));
                            })
                        });
                    } else {
                        errors.password = 'Old password is incorrect';
                        return res.status(400).json(errors)
                    }
                });

            } else {
                errors.password = 'Staff does not exist';
                return res.status(400).json(errors)
            }
        });
});

//@route GET
//@desc GET Single Reader
//@access Private
router.get('/getStaff/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Staff.findById(req.params.id)
        .then(staff => res.json(staff));
});


module.exports = router;
