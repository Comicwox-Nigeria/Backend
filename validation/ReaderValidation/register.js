const Validator = require('validator');
const isEmpty = require('./is-empty.js');

module.exports = function validateRegister (data) {

    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';


    if (Validator.isEmpty(data.username)) {
        errors.username = 'Username Field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if (!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password must be at least 6 characters and at most 30 characters';
    }


    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};
