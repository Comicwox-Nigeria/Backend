const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateComic (data) {

    let errors = {};

    data.comicTitle = !isEmpty(data.comicTitle) ? data.comicTitle : '';
    data.comicDesc = !isEmpty(data.comicDesc) ? data.comicDesc : '';
    data.comicImage = !isEmpty(data.comicImage) ? data.comicImage : '';
    data.studioName = !isEmpty(data.studioName) ? data.studioName : '';
    data.comicChapter = !isEmpty(data.comicChapter) ? data.comicChapter : '';
    data.chapterURL = !isEmpty(data.chapterURL) ? data.chapterURL : '';
    data.comicGenre = !isEmpty(data.comicGenre) ? data.comicGenre : '';
    data.featured = !isEmpty(data.featured) ? data.featured : '';


    if (Validator.isEmpty(data.comicTitle)) {
        errors.comicTitle = 'Comic Title field is required';
    }

    if (Validator.isEmpty(data.comicDesc)) {
        errors.comicDesc = 'Comic Description field is required';
    }

    if (Validator.isEmpty(data.comicImage)) {
        errors.comicImage = 'Comic Image field is required';
    }

    if (Validator.isEmpty(data.studioName)) {
        errors.studioName = 'Studio Name field is required';
    }

    if (Validator.isEmpty(data.comicChapter)) {
        errors.comicChapter = 'Comic Chapter field is required';
    }

    if (Validator.isEmpty(data.chapterURL)) {
        errors.chapterURL = 'Chapter URL field is required';
    }

    if (Validator.isEmpty(data.comicGenre)) {
        errors.comicGenre = 'Comic Genre field is required';
    }

    if (Validator.isEmpty(data.featured)) {
        errors.featured = 'Featured field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};
