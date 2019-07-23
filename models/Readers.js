const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReaderSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    recommended: {
        genre1: {
            type: String
        },
        genre2: {
            type: String
        },
        genre3: {
            type: String
        }
    },
    favorite: [
        {

        }
    ],
    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = Reader = mongoose.model('readers', ReaderSchema);
