const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComicSchema = new Schema({
    comicTitle: {
        type: String,
        required: true
    },
    comicDesc: {
        type: String,
        required: true
    },
    comicImage: {
        type: String
    },
    studioName: {
        type: String,
        required: true
    },
    comicChapter: {
        type: String,
        required: true
    },
    chapterURL: {
        type: String,
        required: true
    },
    comicGenre: {
        type: String,
        required: true
    },
    tags: {
        type: [],
        required: true
    },
    views: [
        {
            username: {
                type: String
            }
        }
    ],
    viewsCount: {
        type: Number,
        default: 0
    },
    uploadDate: {
        type: Date,
        default: Date.now()
    },
    featured: {
        type: String,
        required: true
        // default: false
    },
    commentForComic: [
        {
            readerUsername: {
                type: String
            },
            text: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    commentForChapter:[
        {
            readerUsername: {
                type: String
            },
            text: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]

});


ComicSchema.index({
    comicTitle: 'text'
});

module.exports = Comic = mongoose.model('comics', ComicSchema);
