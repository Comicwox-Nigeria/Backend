const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudioSchema = new Schema({
    studioName: {
       type: String,
       required: true
    },
    email:{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    studioLogo: {
        type: String,
    },
    social: {
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        instagram: {
            type: String
        }
    }

});

module.exports = Studio = mongoose.model('studios', StudioSchema);
