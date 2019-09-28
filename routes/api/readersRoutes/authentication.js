const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/key');
const passport = require('passport');
const config = require('config');

const validateRegister = require('../../../validation/ReaderValidation/register');
const validateProfile = require('../../../validation/ReaderValidation/editProfile');
const validateLogin = require('../../../validation/ReaderValidation/login');

const authReader = require('../../../middleware/auth');

//Load User models
const Reader = require('../../../models/Readers');


// @route GET api/users/test
// @desc Tests user route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'User works'}));


//@desc Register Readers
//@access Public

router.post('/register', (req, res) => {

    const { errors, isValid } = validateRegister(req.body);

//    Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Reader.findOne({username: req.body.username})
        .then(reader => {
            if (reader) {
                errors.username = 'Reader already exists';

                return res.status(400).json(errors);
            } else {
                const newReader = new Reader({
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    recommended: {
                        genre1: 'None',
                        genre2: 'None',
                        genre3: 'None'
                    }
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newReader.password, salt, (err, hash) => {
                        if (err) throw err;

                        newReader.password = hash;
                        newReader.save()
                            .then(reader => {

                                jwt.sign(
                                    { id: reader.id },
                                    config.get('jwtSecret'),
                                    { expiresIn: '24h' },
                                    (err, token) => {
                                        if (err) throw err;
                                        res.json({
                                            reader: {
                                                token,
                                                id: reader.id,
                                                username: reader.username,
                                                email: reader.email,
                                                recommended: reader.recommended,
                                                favorite: reader.favorite
                                            }})
                                    }
                                )
                            })
                            .catch(err => console.log(err))
                    })
                });
            }
        })

});



//@desc Get User Reader /
// REturning the JWT Token
//@access Public
router.get('/getReader', authReader, (req, res) => {
    Reader.findById(req.reader.id)
        .select('-password')
        .then(reader => res.json(reader));
});


//@desc Login Reader /REturning the JWT Token
//@access Public
router.post('/login', (req, res) => {

    const { errors, isValid } = validateLogin(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    Reader.findOne({ email: email })
        .then(reader => {
            if (!reader) {
                errors.email = 'Email does not exists';
                return res.status(404).json(errors)
            }

            //Validate password

            bcrypt.compare(password, reader.password).then(isMatch => {
                if (!isMatch) {
                    errors.password = 'An incorrect Password was entered';
                    return res.status(404).json(errors)
                }


                const payload = {
                    id: reader.id,
                    username: reader.username,
                    email: reader.email,
                    favorite: reader.favorite,
                    recommended: reader.recommended
                };

                jwt.sign(
                    { id: reader.id },
                    config.get('jwtSecret'),
                    { expiresIn: '24h' },
                    (err, token) => {
                        if (err) throw err;
                        res.json({
                            token,
                            reader: {
                                id: reader.id,
                                user: 'Reader',
                                username: reader.username,
                                email: reader.email,
                                favorite: reader.favorite,
                                recommended: reader.recommended
                            }
                        })
                    }
                )

                    //Create JWT Payload

                    /*const payload = {
                        id: reader.id,
                        user: 'Reader',
                        username: reader.username,
                        email: reader.email,
                        favorite: reader.favorite,
                        recommended: reader.recommended
                    };

                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        { expiresIn: '24h' },
                        (err, token) => {
                            res.json({
                                // payload,
                                success: true,
                                readerToken: 'Bearer ' + token + ' Reader'
                            })
                        });*/
            })
        })

});


//@route POST
//@desc Edit the profile of the Reader
//@access Private

router.post('/editProfile', authReader, (req, res) => {

    const { errors, isValid } = validateProfile(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const readerProfile = {};

    if (req.body.username) readerProfile.username = req.body.username;

    readerProfile.recommended = {};

    if (req.body.genre1) readerProfile.recommended.genre1 = req.body.genre1;
    if (req.body.genre2) readerProfile.recommended.genre2 = req.body.genre2;
    if (req.body.genre3) readerProfile.recommended.genre3 = req.body.genre3;


    Reader.findOne({ username: req.body.username })
        .then(reader => {
            if (reader) {


                Reader.findOneAndUpdate(
                    {username: req.body.username},
                    {$set: readerProfile},
                    {new: true})

                    .then(reader => res.json(reader));

            } else {
                return res.status(400).json({message: 'Reader does not exist'});
            }
        });
});


module.exports = router;
