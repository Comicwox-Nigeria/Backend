const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/key');
const passport = require('passport');


const authReader = require('../../../middleware/auth');


//Load User models
const Comic = require('../../../models/Comic');
const Staff = require('../../../models/Staff');
const Reader = require('../../../models/Readers');
const Studio = require('../../../models/Studio');

const validateComment = require('../../../validation/ReaderValidation/comment');


// @route GET api/comic
// @desc Tests user route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'User works'}));



/*
*
* HOME PAGE FOR THE POPULAR COMIC
*
* */

router.get('/popularComics', (req, res) => {
    Comic.find({ comicChapter: 1 }).limit(28).sort({ viewsCount: -1 }).then(comics => {
        if (comics.length > 13) {
            res.status(200).json(comics)
        } else if (comics.length < 14) {
            return res.json({ error: true, message: 'Less than 14 comics'})
        } else {
            const errors = {};
            errors.message = 'No comics';
            return res.json(errors)
        }
    });
});



/*
*
* HOME PAGE FOR THE LATEST UPDATE COMIC
*
* */

router.get('/latestChapterComics', (req, res) => {
    Comic.find({ comicChapter: { $gt: 1 } }).limit(28).sort({ uploadDate: -1 }).then(comics => {
        if (comics.length > 13) {
            res.status(200).json(comics)
        } else if (comics.length < 14) {
            return res.json({ error: true, message: 'Less than 14 comics'})
        } else {
            const errors = {};
            errors.message = 'No comics';
            return res.json(errors)
        }
    });
});


/*
*
* HOME PAGE FOR THE NEW COMIC
*
* */

router.get('/newComics', (req, res) => {
    Comic.find().limit(28).sort({ uploadDate: -1 }).then(comics => {
        if (comics.length > 13) {
            res.status(200).json(comics)
        } else if (comics.length < 14) {
            return res.status(400).json('Less than 14 comics')
        } else {
            return res.status(400).json('No comics')
        }
    });
});


// @desc GET Get all COMIC (Chapter 1)
// @access Public

router.get('/getAllComics', (req, res) => {
    Comic.find({ comicChapter: 1 }).then(comic => res.json(comic));
});

// @desc GET Get Searched COMIC (Chapter 1)
// @access Public

router.get('/getSearchedComic/:comicTitle', (req, res) => {
    let cTitle = req.query.comicTitle;

    Comic.find({ comicTitle: cTitle }, function (err, comic) {
        if (err) {
            res.json({success: false, message: err});
        } else {
            if (!comic) {
                res.json({success: false, message: 'No Comic was found'});
            }
            else {
                if (comic.length === 0) {
                    res.json({success: false, message: 'No Comic was found'});
                }
                else {
                    res.json({success: true, listOfComics: comic});
                }

            }
        }
    })

});

/*
*
* GET A FEATURED COMIC FOR THE HOME PAGE
*
* */

//@desc - Get Featured
//@access Public

router.get('/getFeatured/', (req, res) => {
    Comic.findOne({ featured: true, comicChapter: 1 })
        .limit(1).sort({ uploadDate: -1 })
        .then(comics => res.json(comics));
});

// @desc GET Get A Comic (comicChapter) with sub chapter
// @access Public

router.get('/getChapterOneAndSub/:id', (req, res) => {
   Comic.findOne({ _id: req.params.id })
       .then(singleComic => res.json({singleComic}));
});


// @desc GET Get A Comic (comicChapter) with sub chapter
// @access Public

router.get('/getChapters/:id', (req, res) => {
    Comic.findOne({ _id: req.params.id  })
        .then(comic =>  {
            let x = comic.comicTitle;
            Comic.find({ comicTitle: x }).then(comics => res.json(comics));
        });
});

// @desc GET Get a single comic
// @access Public

router.get('/getSingleComic/:id', (req, res) => {
    Comic.findOne({ _id: req.params.id }).then(singleComic => res.json({singleComic}));
});


// @desc  Add To Reader's Favorite
// @access Private

router.post('/addToFav/:comicTitle', authReader, (req, res) => {

    // let errors = {};

    Comic.findOne({ comicTitle: req.params.comicTitle, comicChapter: 1 }).then(comic => {
        if (comic) {
            Reader.findById(req.reader.id).then(reader => {
                if (reader) {

                    if (reader.username === req.body.username) {
                        if (reader.favorite.filter(fav => fav['comicTitle'] === req.params.comicTitle).length > 0) {
                            return res.status(400).json({ alreadyFavorite: 'You have already this to your favorite' });
                        }

                        reader.favorite.unshift(comic);

                        // const theReader = {
                        //     id: reader.id,
                        //     user: 'Reader',
                        //     username: reader.username,
                        //     email: reader.email,
                        //     favorite: reader.favorite,
                        //     recommended: reader.recommended
                        // };

                        reader.save().then(reader => res.json(reader));

                    } else {
                        res.json({message: 'Reader does not exist'});
                    }

                } else {
                    res.json({message: 'Reader does not exist'});
                }
            })
        } else {
            // errors.message = 'Comic does not exist';
            // return res.status(400).json({message: 'Comic does not exist'});
            res.json({message: 'Comic does not exist'});
        }
    });
});

// @desc POST Remove From Reader's Favorite
// @access Private

router.get('/removeFav/:comicTitle/:username', authReader, (req, res) => {
    Comic.findOne({ comicTitle: req.params.comicTitle, comicChapter: 1 }).then(comic => {
        if (comic) {
            Reader.findOne({ username: req.params.username }).then(reader => {
                if (reader) {

                //  Get remove index
                    const removeIndex = reader.favorite.map(item => item.comic['comicTitle'])
                        .indexOf(req.params.comicTitle);

                    //    Splice out of array
                    reader.favorite.splice(removeIndex, 1);

                    //    Save
                    reader.save().then(reader => res.json(reader));


                }   else {
                    res.json({ error: 'Reader does not exist' })
                }
            })
        } else {
            res.json({ error: 'Comic does not exist' })
        }
    });
});

// @desc POST Add To Comment Under Comic
// @access Private

router.post('/addCommentUnderComic/:id', authReader, (req, res) => {

    const { errors, isValid } = validateComment(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Comic.findOne({ _id: req.params.id, comicChapter: 1 }).then(singleComic => {
        if (singleComic) {
            const newComment = {
                readerUsername: req.body.username,
                text: req.body.text
            };

            //    Add to comments array
            singleComic.commentForComic.unshift(newComment);

            //    Save
            singleComic.save().then(singleComic => res.json({singleComic}));

        } else {
            errors.message = 'Comic does not exist';
            return res.status(400).json(errors)
        }
    });
});


// @desc POST Add To Comment Under Comic And Chapter Using ID of Comic
// @access Private

router.post('/addCommentUnderComicAndChapter/:id', authReader, (req, res) => {

    const { errors, isValid } = validateComment(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Comic.findOne({ _id: req.params.id }).then(singleComic => {
        if (singleComic) {
            const newComment = {
                readerUsername: req.body.username,
                text: req.body.text
            };

            //    Add to comments array
            singleComic.commentForChapter.unshift(newComment);

            //    Save
            singleComic.save().then(singleComic => res.json({singleComic}))

        } else {
            errors.message = 'Comic does not exist';
            return res.status(400).json(errors)
        }
    });
});

// @desc POST Add To Views Under Comic And Chapter Using ID of Comic
// @access Private

router.post('/addViews/:id/:username', authReader, (req, res) => {
    Comic.findOne({ _id: req.params.id, comicChapter: 1 }).then(comic => {
        if (comic) {
            Reader.findOne({username: req.params.username }).then(reader => {
                if (reader) {

                    if (comic.views.filter(view => view['username'] === req.params.username).length > 0) {
                        return res.json({ alreadyFavorite: 'You have already viewed this' });
                    }
                    // let newFave = [...reader.favorite];
                    // newFave.push(comic);

                    comic.views.unshift({ username: reader.username });
                    comic.viewsCount += 1;

                    comic.save().then(comic => res.json(comic));

                }   else {
                    res.json({ error: 'User does not exist' })
                }
            })
        } else {
            res.json({ error: 'Comic does not exist' })
        }
    });
});



/*
*
* HOME PAGE FOR THE RECOMMENDED COMIC
*
* */

//@desc - POST recommended
//@access Public




//@desc - Get recommended
//@access Public

router.get('/getRecommended/:id', authReader, (req, res) => {
    Reader.findById(req.reader.id).then(reader => {
    // Reader.findOne({ username: req.params.username }).then(reader => {
        let recommended = reader.recommended;
        let lengthOfRecommended = Object.keys(recommended).length;
        if (lengthOfRecommended === 4) {
            let genre1 = recommended['genre1'];
            let genre2 = recommended['genre2'];
            let genre3 = recommended['genre3'];

            if (genre1 === 'None' || genre2 === 'None' || genre3 === 'None') {
                return res.json({ error: true,
                    message: 'You do not have any recommended comic because you have not filled your favorite comic genres on your dashboard'
                });
            } else {

                Comic.findOne({ comicGenre: genre1, comicChapter: 1 }).limit(1)
                    // .skip(Math.random() * 9)
                // random : { $gte : rand } })
                    .then(comic1Set => {
                        Comic.findOne({ comicGenre: genre2, comicChapter: 1 }).limit(1)
                            // .skip(Math.random() * 7)
                            .then(comic2Set => {
                                Comic.findOne({ comicGenre: genre3, comicChapter: 1 }).limit(1)
                                    // .skip(Math.random() * 4)
                                    .then(comic3Set => {
                                        let newArray = [];
                                        newArray.push(comic1Set);
                                        newArray.push(comic2Set);
                                        newArray.push(comic3Set);

                                        res.json(newArray);
                                    });
                            });
                    });
            }

        } else {
           return res.json({ error: false, message: 'No comic in the section at the moment'});
        }

    });
});


// Get Favorites
router.get('/getFavorites', authReader, (req, res) => {
    Reader.findById(req.reader.id).then(reader => {
        let favorite = reader.favorite;
        res.json(favorite);
    });
});

//@desc - Get Subscription
//@access Private

router.get('/getSubscription/:id', authReader, (req, res) => {
    Reader.findById(req.reader.id).then(reader => {
        // Reader.findOne({ username: req.params.username }).then(reader => {
        let recommended = reader.recommended;
        let lengthOfRecommended = Object.keys(recommended).length;
        if (lengthOfRecommended === 4) {
            let genre1 = recommended['genre1'];
            let genre2 = recommended['genre2'];
            let genre3 = recommended['genre3'];

            if (genre1 === 'None' || genre2 === 'None' || genre3 === 'None') {
                return res.json({ error: true,
                    message: 'You do not have any subscription comic because you have not filled your favorite comic genres on your dashboard'
                });
            } else {

                Comic.find({ $or: [ {comicGenre:genre1}, {comicGenre:genre2}, {comicGenre:genre3}, {featured: false} ], comicChapter: 1 })
                    .limit(24)
                    .then(comic => {
                        res.json(comic)
                    })
            }

        } else {
            return res.json({ error: false, message: 'No comic in the section at the moment'});
        }

    });
});



module.exports = router;
