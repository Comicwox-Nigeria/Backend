const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/key');
const passport = require('passport');


const validateStaff = require('../../../validation/AdminValidation/staff');

// const validateStaff = require('../../../validation/AdminValidation/staff');


//Load User models
const Admin = require('../../../models/Admin');
const Reader = require('../../../models/Readers');


//@route GET
//@desc GET All the Reader
//@access Private
router.get('/getAllReader', passport.authenticate('jwt', { session: false }), (req, res) => {

    Reader.find()
        .sort({ date: -1 })
        .then(readers => res.json(readers));
});

//@route GET
//@desc GET Single Reader
//@access Private
router.get('/getAReader/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Reader.findById(req.params.id)
        .then(readers => res.json(readers));
});

//@route DELETE
//@desc DELETE Reader
//@access Private
router.delete('/deleteReader/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Reader.findById(req.params.id)
        .then(readers => {
            readers.remove().then(() => res.json({ success: true }));
        });
});

//@route POST
//@desc This is to reset the password of reader
//@access Private
router.post('/resetReaderPassword/:username',  passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateProfile(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const staffFields = {};

    if (req.body.username) staffFields.username = req.params.username;
    staffFields.password = 'ComicWoxWorks';

    Reader.findOne({ username: req.params.username })
        .then(staff => {
            if (staff) {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(staffFields.password, salt, (err, hash) => {
                        if (err) throw err;

                        staffFields.password = hash;


                        Reader.findOneAndUpdate(
                            {username: req.params.username},
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
