const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },

    publication_year: {
        type: Number,
        required: true
    },
    ratings: [
        {
            star: { type: Number },
            postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
            comment: { type: String }
        }
    ],
    totalsRatings: {
        type: Number,
        default: 0
    },
    category_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },


}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('Book', bookSchema);