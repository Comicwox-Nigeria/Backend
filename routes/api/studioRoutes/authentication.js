const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/key');
const passport = require('passport');

const validateRegistration = require('../../../validation/StudioValidation/register');

const validateLogin = require('../../../validation/StudioValidation/login');

//Load User models
const Studio = require('../../../models/Studio');


// @route GET api/users/test
// @desc Tests user route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'User works'}));


//@route GET api/studio/register
//@desc Register Studio
//@access Public

router.post('/register', (req, res) => {

    const { errors, isValid } = validateRegistration(req.body);

//    Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Studio.findOne({email: req.body.email})
        .then(studio => {
            if (studio) {
                errors.message = 'Studio already exists';

                return res.status(400).json({ errors });
            } else {
                const newStudio = new Studio({
                    studioName: req.body.studioName,
                    email: req.body.email,
                    password: req.body.password,
                    description: 'No Description',
                    studioLogo: 'No Studio Logo',
                    social: {
                        twitter: 'No Twitter handle',
                        facebook: 'No Facebook handle',
                        instagram: 'No Instagram handle'
                    }
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newStudio.password, salt, (err, hash) => {
                        if (err) throw err;

                        newStudio.password = hash;
                        newStudio.save()
                            .then(studio => res.json({studio}))
                            .catch(err => console.log(err))
                    })
                });
            }
        })

});

//@route GET
//@desc Login Studio
//@access Public

router.post('/login', (req, res) => {

    const { errors, isValid } = validateLogin(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    Studio.findOne({ email: email})
        .then(studio => {
            if (!studio) {
                errors.message = 'Wrong Email Or Password';
                return res.status(404).json({ errors })
            }

            bcrypt.compare(password, studio.password).then(isMatch => {
                if (isMatch) {
                    //Create JWT Payload
                    const payload = {
                        id: studio.id,
                        user: 'Studio',
                        studioName: studio.studioName
                    };

                    jwt.sign(payload, keys.secretOrKey, { expiresIn: '24h' },
                        (err, token) => {
                            res.json({
                                // payload,
                                success: true,
                                token: 'Bearer ' + token + ' Studio'
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
//@desc Edit the profile of the Studio
//@access Private

router.post('/editProfile',  passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateRegistration(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const studioProfile = {};

    if (req.body.studioName) studioProfile.studioName = req.body.studioName;
    // if (req.body.email) studioProfile.email = req.body.email;
    if (req.body.description) studioProfile.description = req.body.description;
    if (req.body.studioLogo) studioProfile.studioLogo = req.body.studioLogo;

    studioProfile.social = {};

    if (req.body.twitter) studioProfile.social.twitter = req.body.twitter;
    if (req.body.facebook) studioProfile.social.facebook = req.body.facebook;
    if (req.body.instagram) studioProfile.social.instagram = req.body.instagram;

    Studio.findOne({ email: req.body.email })
        .then(studio => {
            if (studio) {
                Studio.findOneAndUpdate({email: req.body.email}, {$set: studioProfile}, {new: true})
                    .then(studio => res.json(studio));

            } else {
                return res.status(400).json({message: 'Studio does not exist'});
            }
        });
});


module.exports = router;
