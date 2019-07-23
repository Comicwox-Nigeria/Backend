const Validator = require('validator');
const isEmpty = require('./is-empty.js');

module.exports = function validateRegisterInput (data) {

    let errors = {};

    data.username = !isEmpty(data.username) ? data.username : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';


    if (!Validator.isLength(data.username, { min: 2, max: 50})) {

        errors.username = 'Username must be between 2 and 50 characters';

    }

    if (Validator.isEmpty(data.username)) {
        errors.username = 'Username Field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if (Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm Password field is required';
    }

    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Passwords must match';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};
