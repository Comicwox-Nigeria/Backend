const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../../config/key');
const passport = require('passport');

const validateRegister = require('../../../validation/ReaderValidation/register');
const validateLogin = require('../../../validation/ReaderValidation/login');


//Load User models
const Reader = require('../../../models/Readers');


// @route GET api/users/test
// @desc Tests user route
// @access Public
router.get('/test', (req, res) => res.json({ msg: 'User works'}));


//@route GET api/users/register
//@desc Register User
//@access Public

router.post('/register', (req, res) => {

    const { errors, isValid } = validateRegister(req.body);

//    Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Admin.findOne({username: req.body.username})
        .then(admin => {
            if (admin) {
                errors.message = 'Admin already exists';

                return res.status(400).json({ errors });
            } else {
                const newAdmin = new Admin({
                    username: req.body.username,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newAdmin.password, salt, (err, hash) => {
                        if (err) throw err;

                        newAdmin.password = hash;
                        newAdmin.save()
                            .then(admin => res.json({admin}))
                            .catch(err => console.log(err))
                    })
                });
            }
        })

});

//@route GET api/admin/login
//@desc Login Admin /REturning the JWT Token
//@access Public
router.post('/login', (req, res) => {

    const { errors, isValid } = validateLogin(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const username = req.body.username;
    const password = req.body.password;

    Admin.findOne({ username: username})
        .then(admin => {
            if (!admin) {
                errors.message = 'Admin not found';
                return res.status(404).json({ errors })
            }

            bcrypt.compare(password, admin.password).then(isMatch => {
                if (isMatch) {
                    //Create JWT Payload
                    const payload = {
                        id: admin.id,
                        user: 'Admin',
                        username: admin.username
                    };

                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        { expiresIn: '24h' },
                        (err, token) => {
                            res.json({
                                // payload,
                                success: true,
                                token: 'Bearer ' + token + ' Admin'
                            })
                        });
                } else {
                    errors.password = 'Password is incorrect';
                    return res.status(400).json(errors)
                }
            })
        })

});

//@desc - Get recommended
//@access Public

router.get('/getRecommended/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
   Reader.findOne({ username: req.params.username }).then(reader => {
    let recommended = reader.recommended;
    let lengthOfRecommended = Object.keys(recommended).length;
    if (lengthOfRecommended === 4) {
        let genre1 = recommended['genre1'];
        let genre2 = recommended['genre2'];
        let genre3 = recommended['genre3'];

        Comic.find({ comicGenre: genre1, comicChapter: 1 }).limit(9).skip(Math.random() * 9)
            // random : { $gte : rand } })
            .then(comic1Set => {
                Comic.find({ comicGenre: genre2, comicChapter: 1 }).limit(7).skip(Math.random() * 7)
                    .then(comic2Set => {
                        Comic.find({ comicGenre: genre3, comicChapter: 1 }).limit(4).skip(Math.random() * 4)
                            .then(comic3Set => {
                                let newArray = [];
                                newArray.push(comic1Set);
                                newArray.push(comic2Set);
                                newArray.push(comic3Set);
                                res.json({ recommended: newArray });
                            });
                    });
            });

    } else {
        res.json({ success: false, message: 'Fill in the 3 genres' })
    }

   }); 
});


//@desc - Get Favorites
//@access Public

router.get('/getFavorite/:username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Reader.findOne({ username: req.params.username })
        .limit(20)
        .then(reader => {
        if (reader) {
            res.json(reader.favorite);
        }
    });
});


module.exports = router;
