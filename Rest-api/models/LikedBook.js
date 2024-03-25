const mongoose = require('mongoose');

const likedBookSchema = new mongoose.Schema({
    bookId: String,
    ownerId: String
});

module.exports = mongoose.model('LikedBook', likedBookSchema);
