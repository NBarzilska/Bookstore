// communicationThread.model.js
const mongoose = require('mongoose');

const communicationThreadSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  bookTitle: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  otherParty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastMessage: String,
  otherPartyUsername: {
    type: String,
    required: false
  },
});

module.exports = mongoose.model('CommunicationThread', communicationThreadSchema);
