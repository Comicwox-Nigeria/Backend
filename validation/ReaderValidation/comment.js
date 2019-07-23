const Validator = require('validator');
const isEmpty = require('./is-empty.js');

module.exports = function validateComment (data) {

    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';


    if (Validator.isEmpty(data.text)) {
        errors.message = 'Comment Field is required';
    }

    if (!Validator.isLength(data.text, {min: 6})) {
        errors.message = 'Comment must be at least 6 characters and at most 30 characters';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };

};
