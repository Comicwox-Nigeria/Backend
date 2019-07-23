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


// @desc GET Get number of COMIC OF each Studio
// @access Private

router.get('/getComicsSingle/:studioName', passport.authenticate('jwt', { session: false }), (req, res) => {
    Comic.find({ studioName: req.params.studioName, comicChapter: 1 })
        .then(comic => {
            if (comic) {
                res.json(comic);
            } else {
                res.json({success: false, message: 'No comic under this studio'})
            }
        });

});

// @desc GET Get number of COMIC with Chapters
// @access Private

router.get('/getAComicWithChapter/:studioName/:comicTitle', passport.authenticate('jwt', { session: false }), (req, res) => {
    Comic.find({ studioName: req.params.studioName, comicTitle: req.params.comicTitle })
        .then(comic => {
            if (comic) {
                res.json(comic);
            } else {
                res.json({success: false, message: 'No comic under this studio'})
            }
        });

});





module.exports = router;
