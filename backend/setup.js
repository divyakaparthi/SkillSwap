const fs = require('fs');

const files = {

'config/db.js': `const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected: ' + conn.connection.host);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
module.exports = connectDB;`,

'config/cloudinary.js': `const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
module.exports = cloudinary;`,

'config/redis.js': `const { createClient } = require('redis');
const client = createClient({ url: process.env.REDIS_URL });
client.on('error', (err) => console.error('Redis error:', err));
client.connect();
module.exports = client;`,

'middleware/errorHandler.js': `const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
module.exports = errorHandler;`,

'middleware/rateLimiter.js': `const rateLimit = require('express-rate-limit');
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests.' },
});`,

'middleware/auth.js': `const jwt = require('jsonwebtoken');
const User = require('../models/User');
const protect = async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
    ? req.headers.authorization.split(' ')[1] : null;
  if (!token) return res.status(401).json({ success: false, message: 'No token' });
  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch (e) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
module.exports = { protect };`,

'middleware/upload.js': `const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: 'skillswap/avatars', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
});
module.exports = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });`,

'models/User.js': `const mongoose = require('mongoose');
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
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
UserSchema.methods.matchPassword = function(entered) {
  return bcrypt.compare(entered, this.password);
};
module.exports = mongoose.model('User', UserSchema);`,

'models/Message.js': `const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: String, required: true, index: true },
  text: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Message', MessageSchema);`,

'models/Review.js': `const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: '' },
  skillTag: { type: String, default: '' },
}, { timestamps: true });
ReviewSchema.index({ reviewer: 1, reviewee: 1 }, { unique: true });
module.exports = mongoose.model('Review', ReviewSchema);`,

'services/matchService.js': `const normalize = (s) => s.toLowerCase().trim();
const computeScore = (viewer, target) => {
  const vHave = viewer.skillsHave.map(normalize);
  const vWant = viewer.skillsWant.map(normalize);
  const tHave = target.skillsHave.map(normalize);
  const tWant = target.skillsWant.map(normalize);
  const viewerGets = vWant.filter(s => tHave.includes(s)).length;
  const targetGets = vHave.filter(s => tWant.includes(s)).length;
  const totalPossible = Math.max(vWant.length + vHave.length, 1);
  const overlap = ((viewerGets + targetGets) / totalPossible) * 70;
  const rating = target.rating > 0 ? (target.rating / 5) * 20 : 0;
  const activity = Math.min(target.swapsCount, 10) * 1;
  return Math.round(Math.min(overlap + rating + activity, 100));
};
module.exports = { computeScore };`,

'services/badgeService.js': `const assignBadges = (user) => {
  const badges = [];
  if (user.swapsCount >= 1) badges.push('First Swap');
  if (user.swapsCount >= 5) badges.push('Active Learner');
  if (user.swapsCount >= 10) badges.push('Skill Champion');
  if (user.rating >= 4.5 && user.reviewCount >= 3) badges.push('Top Mentor');
  user.badges = badges;
};
module.exports = { assignBadges };`,

'socket/socket.js': `const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const roomId = (a, b) => [a, b].sort().join('_');
const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] },
  });
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth && socket.handshake.auth.token;
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = id;
      next();
    } catch (e) { next(new Error('Unauthorised')); }
  });
  io.on('connection', async (socket) => {
    await User.findByIdAndUpdate(socket.userId, { isOnline: true });
    socket.broadcast.emit('user:online', { userId: socket.userId });
    socket.on('chat:join', ({ peerId }) => socket.join(roomId(socket.userId, peerId)));
    socket.on('chat:message', async ({ peerId, text }) => {
      const room = roomId(socket.userId, peerId);
      const msg = await Message.create({ sender: socket.userId, receiver: peerId, roomId: room, text });
      const pop = await msg.populate('sender receiver', 'name avatar');
      io.to(room).emit('chat:message', pop);
    });
    socket.on('chat:typing', ({ peerId }) => socket.to(roomId(socket.userId, peerId)).emit('chat:typing', { userId: socket.userId }));
    socket.on('chat:stopTyping', ({ peerId }) => socket.to(roomId(socket.userId, peerId)).emit('chat:stopTyping', { userId: socket.userId }));
    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: new Date() });
      socket.broadcast.emit('user:offline', { userId: socket.userId });
    });
  });
};
module.exports = { initSocket };`,

'routes/auth.js': `const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
module.exports = router;`,

'routes/users.js': `const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getUser, updateProfile, uploadAvatar, getConnections } = require('../controllers/userController');
router.get('/connections', protect, getConnections);
router.get('/:id', protect, getUser);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
module.exports = router;`,

'routes/matches.js': `const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMatches, connect, disconnect } = require('../controllers/matchController');
router.get('/', protect, getMatches);
router.post('/connect/:userId', protect, connect);
router.delete('/connect/:userId', protect, disconnect);
module.exports = router;`,

'routes/chat.js': `const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getConversations, getHistory, sendMessage, markRead } = require('../controllers/chatController');
router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getHistory);
router.post('/:userId', protect, sendMessage);
router.patch('/:userId/read', protect, markRead);
module.exports = router;`,

'routes/reviews.js': `const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createReview, getReviews } = require('../controllers/reviewController');
router.post('/:userId', protect, createReview);
router.get('/:userId', protect, getReviews);
module.exports = router;`,

'controllers/authController.js': `const jwt = require('jsonwebtoken');
const User = require('../models/User');
const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, college, year } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered' });
    const user = await User.create({ name, email, password, college, year });
    res.status(201).json({ success: true, token: signToken(user._id), user });
  } catch (err) { next(err); }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    res.json({ success: true, token: signToken(user._id), user });
  } catch (err) { next(err); }
};
exports.getMe = (req, res) => res.json({ success: true, user: req.user });`,

'controllers/userController.js': `const User = require('../models/User');
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) { next(err); }
};
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, college, year, bio, skillsHave, skillsWant } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id,
      { name, college, year, bio, skillsHave, skillsWant },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (err) { next(err); }
};
exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file' });
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: req.file.path }, { new: true });
    res.json({ success: true, avatar: user.avatar });
  } catch (err) { next(err); }
};
exports.getConnections = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'connections', 'name avatar college year skillsHave skillsWant rating badges isOnline'
    );
    res.json({ success: true, connections: user.connections });
  } catch (err) { next(err); }
};`,

'controllers/matchController.js': `const User = require('../models/User');
const { computeScore } = require('../services/matchService');
exports.getMatches = async (req, res, next) => {
  try {
    const { minScore = 0, page = 1, limit = 20 } = req.query;
    const candidates = await User.find({ _id: { $ne: req.user._id } })
      .select('name email college year avatar bio skillsHave skillsWant rating reviewCount swapsCount badges isOnline');
    const scored = candidates
      .map(u => ({ user: u, score: computeScore(req.user, u) }))
      .filter(m => m.score >= Number(minScore))
      .sort((a, b) => b.score - a.score);
    const total = scored.length;
    const paged = scored.slice((page - 1) * limit, page * limit);
    res.json({ success: true, total, page: Number(page),
      pages: Math.ceil(total / limit),
      matches: paged.map(({ user, score }) => ({ ...user.toObject(), matchScore: score })) });
  } catch (err) { next(err); }
};
exports.connect = async (req, res, next) => {
  try {
    const viewer = await User.findById(req.user._id);
    if (!viewer.connections.includes(req.params.userId)) {
      viewer.connections.push(req.params.userId);
      await viewer.save();
    }
    res.json({ success: true, message: 'Connected!' });
  } catch (err) { next(err); }
};
exports.disconnect = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { $pull: { connections: req.params.userId } });
    res.json({ success: true, message: 'Disconnected' });
  } catch (err) { next(err); }
};`,

'controllers/chatController.js': `const Message = require('../models/Message');
const roomId = (a, b) => [a, b].sort().join('_');
exports.getHistory = async (req, res, next) => {
  try {
    const room = roomId(req.user._id.toString(), req.params.userId);
    const messages = await Message.find({ roomId: room })
      .sort({ createdAt: 1 }).populate('sender receiver', 'name avatar');
    res.json({ success: true, messages });
  } catch (err) { next(err); }
};
exports.sendMessage = async (req, res, next) => {
  try {
    const room = roomId(req.user._id.toString(), req.params.userId);
    const msg = await Message.create({ sender: req.user._id, receiver: req.params.userId, roomId: room, text: req.body.text });
    res.status(201).json({ success: true, message: msg });
  } catch (err) { next(err); }
};
exports.markRead = async (req, res, next) => {
  try {
    const room = roomId(req.user._id.toString(), req.params.userId);
    await Message.updateMany({ roomId: room, receiver: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (err) { next(err); }
};
exports.getConversations = async (req, res, next) => {
  try {
    const uid = req.user._id.toString();
    const latest = await Message.aggregate([
      { $match: { roomId: { $regex: uid } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$roomId', lastMsg: { $first: '$$ROOT' } } },
    ]);
    res.json({ success: true, conversations: latest });
  } catch (err) { next(err); }
};`,

'controllers/reviewController.js': `const Review = require('../models/Review');
const User = require('../models/User');
const { assignBadges } = require('../services/badgeService');
exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment, skillTag } = req.body;
    const reviewee = await User.findById(req.params.userId);
    if (!reviewee) return res.status(404).json({ success: false, message: 'User not found' });
    if (req.user._id.equals(reviewee._id))
      return res.status(400).json({ success: false, message: 'Cannot review yourself' });
    const review = await Review.create({ reviewer: req.user._id, reviewee: reviewee._id, rating, comment, skillTag });
    const all = await Review.find({ reviewee: reviewee._id });
    const avg = all.reduce((s, r) => s + r.rating, 0) / all.length;
    reviewee.rating = Math.round(avg * 10) / 10;
    reviewee.reviewCount = all.length;
    reviewee.swapsCount += 1;
    assignBadges(reviewee);
    await reviewee.save();
    res.status(201).json({ success: true, review });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Already reviewed' });
    next(err);
  }
};
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar').sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) { next(err); }
};`

};

let count = 0;
for (const [filePath, content] of Object.entries(files)) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Written: ' + filePath);
  count++;
}
console.log('\nALL ' + count + ' FILES WRITTEN SUCCESSFULLY');