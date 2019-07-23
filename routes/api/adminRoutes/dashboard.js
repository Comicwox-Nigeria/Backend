const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/key');
const passport = require('passport');


//Load User models
const Comic = require('../../../models/Comic');
const Staff = require('../../../models/Staff');
const Reader = require('../../../models/Readers');
const Studio = require('../../../models/Studio');


// @route GET api/comic
// @desc Tests user route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'User works'}));


// @desc GET Get number of COMIC
// @access Private

router.get('/getNumberOfComic', passport.authenticate('jwt', { session: false }), (req, res) => {
    Comic.find().then(comic => res.json(comic.length));
});

// @desc GET Get number of READER
// @access Private

router.get('/getNumberOfReaders', passport.authenticate('jwt', { session: false }), (req, res) => {
    Reader.find().then(reader => res.json(reader.length));
});

// @desc GET Get number of STAFF
// @access Private

router.get('/getNumberOfStaff', passport.authenticate('jwt', { session: false }), (req, res) => {
    Staff.find().then(staff => res.json(staff.length));
});

// @desc GET Get number of STUDIO
// @access Private

router.get('/getNumberOfStudio', passport.authenticate('jwt', { session: false }), (req, res) => {
    Studio.find().then(studio => res.json(studio.length));
});

module.exports = router;
