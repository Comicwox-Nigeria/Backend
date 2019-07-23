const Validator = require('validator');
const isEmpty = require('./is-empty.js');

module.exports = function validateStaffInput (data) {

    let errors = {};

    data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
    data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
    data.username = !isEmpty(data.username) ? data.username : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';


    if (!Validator.isLength(data.username, { min: 2, max: 50})) {

        errors.username = 'Username must be between 2 and 50 characters';

    }

    if (Validator.isEmpty(data.firstName)) {
        errors.firstName = 'First Name Field is required';
    }

    if (Validator.isEmpty(data.lastName)) {
        errors.lastName = 'Last Name Field is required';
    }

    if (Validator.isEmpty(data.username)) {
        errors.username = 'Username Field is required';
    }


    return {
        errors,
        isValid: isEmpty(errors)
    };

};
