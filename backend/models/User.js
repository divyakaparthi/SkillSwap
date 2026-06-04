const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  college: { type: String, default: '' },
  year: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 300 },
  avatar: { type: String, default: '' },
  skillsHave: [{ type: String, trim: true }],
  skillsWant: [{ type: String, trim: true }],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  badges: [{ type: String }],
  swapsCount: { type: Number, default: 0 },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
}, { timestamps: true });
UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();
  const salt = bcrypt.genSaltSync(12);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});
UserSchema.methods.matchPassword = function(entered) {
  return bcrypt.compare(entered, this.password);
};
module.exports = mongoose.model('User', UserSchema);