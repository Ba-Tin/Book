const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var bookContentSchema = new mongoose.Schema({

    book_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Book'
    },
    content: {
        type: String,
        required: true
    }

}, {
    timestamps: true
});

//Export the model
module.exports = mongoose.model('BookContent', bookContentSchema);