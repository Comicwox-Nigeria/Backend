const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/key');
const passport = require('passport');


//Load User models
const Comic = require('../../../models/Comic');
const Studio = require('../../../models/Studio');



// @desc GET Get All Studios by page limited by 20 results and skips 20 per page
// @access Private

router.get('/getStudios', (req, res) => {
    // const page = parseInt(req.params.id);

    // let newPage;
    // if (page === 1){
    //     newPage = 0;
    // } else {
    //     newPage = 10 * page;
    // }
    // const page = 1;
    Studio.find()
        // .skip(newPage).limit(10)
        .then(studio => res.json(studio));
});


// @desc GET Get Profile of a single Studio
// @access Private

router.get('/getStudio/:id', (req, res) => {
    // const page = 1;
    Studio.findOne({ _id: req.params.id }).then(studio => {
        let studioName = studio.studioName;
        let newArray = [];
        // newArray.push(studio);
        Comic.find({studioName: studioName})
            .then(comic => {
                if (comic) {
                    // newArray.push(comic);
                    res.json({ success: true, studio: studio, comic: comic});
                    // res.json(newArray)
                } else {
                    res.json({ success: false, message: 'Studio has no comics' });
                }
            });
    });
});


module.exports = router;
