const Validator = require('validator');
const isEmpty = require('./is-empty.js');

module.exports = function validateChangePassword (data) {

    let errors = {};

    data.password1 = !isEmpty(data.password1) ? data.password1 : '';
    data.password = !isEmpty(data.password) ? data.password : '';


    if (!Validator.isLength(data.password1, { min: 7 })) {

        errors.password1 = 'Password must be more than 7 character';

    }

    if (!Validator.isLength(data.password, { min: 7 })) {

        errors.password = 'New password must be more than 7 character';

    }

    if (Validator.isEmpty(data.password1)) {
        errors.password1 = 'Password Field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'New password field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};
