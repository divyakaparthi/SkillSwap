const User = require('../models/User');
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
};