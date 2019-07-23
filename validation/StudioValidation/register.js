const Validator = require('validator');
const isEmpty = require('./is-empty.js');

module.exports = function validateRegister (data) {

    let errors = {};

    data.studioName = !isEmpty(data.studioName) ? data.studioName : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.description = !isEmpty(data.description) ? data.description : '';


    if (Validator.isEmpty(data.studioName)) {
        errors.studioName = 'Studio Name Field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    // if (Validator.isEmpty(data.description)) {
    //     errors.description = 'Description field is required';
    // }

    /*if (!isEmpty(data.twitter)) {
        if (!Validator.isURL(data.twitter)) {
            errors.twitter = 'Not a valid URL';
        }
    }

    if (!isEmpty(data.facebook)) {
        if (!Validator.isURL(data.facebook)) {
            errors.facebook = 'Not a valid URL';
        }
    }

    if (!isEmpty(data.instagram)) {
        if (!Validator.isURL(data.instagram)) {
            errors.instagram = 'Not a valid URL';
        }
    }*/

    return {
        errors,
        isValid: isEmpty(errors)
    };

};
