const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: String, required: true, index: true },
  text: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Message', MessageSchema);