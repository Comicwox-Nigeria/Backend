const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/key');
const passport = require('passport');

const validateStaff = require('../../../validation/AdminValidation/staff');


//Load User models
const Admin = require('../../../models/Admin');
const Staff = require('../../../models/Staff');



//@route POST
//@desc ADD OR UPDATE Staff
//@access Private
router.post('/addStaff', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateStaff(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const defaultPassword = 'ComicWox';

    Staff.findOne({ username: req.body.username })
        .then(staff => {
            if (staff) {

                errors.username = 'Staff already exists';

                return res.status(400).json(errors);

            } else {

                const newStaff = new Staff({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    username: req.body.username,
                    password: defaultPassword
                });

                //   Save Profile
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newStaff.password, salt, (err, hash) => {
                        if (err) throw err;

                        newStaff.password = hash;
                        newStaff.save()
                            .then(staff => res.json(staff))
                            .catch(err => console.log(err))
                    })
                });
            }
        });
});

//@route GET
//@desc GET All the staff
//@access Private
router.get('/getAllStaff', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateStaff(req.body);

    Staff.find()
        .sort({ date: -1 })
        // .then(staff => res.json(staff.length));
        .then(staff => res.json(staff));
});

//@route GET
//@desc GET Single Staff
//@access Private
router.get('/getAStaff/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Staff.findById(req.params.id)
        .then(staff => res.json(staff));
});

//@route DELETE
//@desc DELETE Staff
//@access Private
router.delete('/deleteStaff/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Staff.findById(req.params.id)
        .then(staff => {
            staff.remove().then(() => res.json({ success: true }));
        });
});

//@route POST
//@desc This is to reset the password of staffs
//@access Private
router.post('/resetStaffPassword/:id',  passport.authenticate('jwt', { session: false }), (req, res) => {

    // const { errors, isValid } = validateStaff(req.body);

    // if (!isValid) {
    //     return res.status(400).json(errors);
    // }

    const staffFields = {};

    // if (req.body.username) staffFields.username = req.params.username;
    staffFields.password = 'ComicWoxWorks';

    Staff.findById(req.params.id)
        .then(staff => {
            if (staff) {
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
                return res.status(400).json({message: 'Staff does not exist'});
            }
        });
});


module.exports = router;
