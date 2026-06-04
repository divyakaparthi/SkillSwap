const User = require('../models/User');
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
};
exports.searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, users: [] });
    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { skillsHave: { $elemMatch: { $regex: q, $options: 'i' } } },
        { skillsWant: { $elemMatch: { $regex: q, $options: 'i' } } },
        { college: { $regex: q, $options: 'i' } },
      ]
    }).select('name avatar college year skillsHave skillsWant rating isOnline').limit(10);
    res.json({ success: true, users });
  } catch (err) { next(err); }
};
exports.getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('name avatar college year skillsHave rating reviewCount swapsCount badges isOnline')
      .sort({ swapsCount: -1, rating: -1 })
      .limit(20);
    res.json({ success: true, users });
  } catch (err) { next(err); }
};