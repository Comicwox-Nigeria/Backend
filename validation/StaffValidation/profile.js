const Validator = require('validator');
const isEmpty = require('./is-empty.js');

module.exports = function validateProfileInput (data) {

    let errors = {};

    data.password = !isEmpty(data.password) ? data.password : '';


    if (Validator.isEmpty(data.username)) {
        errors.username = 'Username Field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};
