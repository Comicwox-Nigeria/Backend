const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

const Admin = mongoose.model('admins');
const Staff = mongoose.model('staffs');
const Studio = mongoose.model('studios');
const Reader = mongoose.model('readers');

const keys = require('../config/key');

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {

    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        if (jwt_payload.user === 'Staff') {
            Staff.findById(jwt_payload.id)
                .then(staff => {
                    if (staff) {
                        return done(null, staff);
                    }
                    return (null, false);
                })
                .catch(err => console.log(err));
        } else if (jwt_payload.user === 'Admin') {
            Admin.findById(jwt_payload.id)
                .then(admin => {
                    if (admin) {
                        return done(null, admin);
                    }
                    return (null, false);
                })
                .catch(err => console.log(err));
        } else if (jwt_payload.user === 'Studio') {
            Studio.findById(jwt_payload.id)
                .then(studio => {
                    if (studio) {
                        return done(null, studio);
                    }
                    return (null, false);
                })
                .catch(err => console.log(err));
        } else if (jwt_payload.user === 'Reader') {
            Reader.findById(jwt_payload.id)
                .then(reader => {
                    if (reader) {
                        return done(null, reader);
                    }
                    return (null, false);
                })
                .catch(err => console.log(err));
        }
    }));
};
