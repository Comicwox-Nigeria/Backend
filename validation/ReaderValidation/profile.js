const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateComic (data) {

    let errors = {};

    data.studioName = !isEmpty(data.studioName) ? data.studioName : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.description = !isEmpty(data.description) ? data.description : '';
    data.studioLogo = !isEmpty(data.studioLogo) ? data.studioLogo : '';
    data.twitter = !isEmpty(data.twitter) ? data.twitter : '';
    data.facebook = !isEmpty(data.facebook) ? data.facebook : '';
    data.instagram = !isEmpty(data.instagram) ? data.instagram : '';


    if (Validator.isEmpty(data.studioName)) {
        errors.studioName = 'Studio Name field is required';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    if (Validator.isEmpty(data.description)) {
        errors.description = 'Description field is required';
    }

    if (Validator.isEmpty(data.studioLogo)) {
        errors.studioLogo = 'Stu field is required';
    }

    if (Validator.isEmpty(data.chapterURL)) {
        errors.chapterURL = 'Chapter URL field is required';
    }

    if (Validator.isEmpty(data.comicGenre)) {
        errors.comicGenre = 'Comic Genre field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};
