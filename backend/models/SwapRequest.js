const mongoose = require('mongoose');

const SwapRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderSkill: { type: String, required: true },
  receiverSkill: { type: String, required: true },
  message: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
}, { timestamps: true });

// Prevent duplicate requests
SwapRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

module.exports = mongoose.model('SwapRequest', SwapRequestSchema);