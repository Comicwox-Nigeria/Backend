const Validator = require('validator');
const isEmpty = require('./is-empty.js');

module.exports = function validateProfile (data) {

    let errors = {};

    data.genre1 = !isEmpty(data.genre1) ? data.genre1 : '';
    data.genre2 = !isEmpty(data.genre2) ? data.genre2 : '';
    data.genre3 = !isEmpty(data.genre3) ? data.genre3 : '';


    if (Validator.isEmpty(data.genre1)) {
        errors.genre1 = 'Genre Field is required';
    }

    if (Validator.isEmpty(data.genre2)) {
        errors.genre2 = 'Genre Field is required';
    }

    if (Validator.isEmpty(data.genre3)) {
        errors.genre3 = 'Genre Field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};
