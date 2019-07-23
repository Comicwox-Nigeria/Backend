const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/key');
const passport = require('passport');

const validateComic = require('../../../validation/StaffValidation/comic');


//Load User models
const Staff = require('../../../models/Staff');
const Comic = require('../../../models/Comic');



//@route POST
//@desc POST AND UPDATE Comic
//@access Private
router.post('/uploadComics', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateComic(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const comicFields = {};

    if (req.body.comicTitle) comicFields.comicTitle = req.body.comicTitle;
    if (req.body.comicDesc) comicFields.comicDesc = req.body.comicDesc;
    if (req.body.comicImage) comicFields.comicImage = req.body.comicImage;
    if (req.body.studioName) comicFields.studioName = req.body.studioName;
    if (req.body.comicChapter) comicFields.comicChapter = req.body.comicChapter;
    if (req.body.chapterURL) comicFields.chapterURL = req.body.chapterURL;
    if (req.body.comicGenre) comicFields.comicGenre = req.body.comicGenre;
    if (req.body.featured) comicFields.featured = req.body.featured;

    // Tags
    if (typeof req.body.tags !== 'undefined') {
        comicFields.tags = req.body.tags.split(',');
    }

    Comic.findOne({ comicTitle: req.body.comicTitle, comicChapter: req.body.comicChapter })
        .then(comic => {
            if (comic) {

                Comic.findOneAndUpdate(
                    {comicTitle: req.body.comicTitle, comicChapter: req.body.comicChapter},
                    {$set: comicFields},
                    {new: true}
                )
                    .then(comic => res.json(comic));

                // errors.comicAlreadyExists = 'Comic already exists';

                // return res.status(400).json({errors});
            } else {
                //   Save Profile
                new Comic(comicFields).save().then(comic => res.json(comic));
            }
        });
});

//@route POST
//@desc POST Comics
//@access Private
router.get('/getAllComics', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validateComic(req.body);

    Comic.find()
        .sort({ uploadDate: -1 })
        .then(comic => res.json(comic));
});

//@route GET
//@desc GET Single Comic
//@access Private
router.get('/getAComic/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Comic.findById(req.params.id)
        .then(comic => res.json(comic));
});



//@route DELETE
//@desc DELETE Single Comic
//@access Private
router.delete('/deleteComic/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Comic.findById(req.params.id)
        .then(comic => {
            comic.remove().then(() => res.json({ success: true }));
        });
});

module.exports = router;
