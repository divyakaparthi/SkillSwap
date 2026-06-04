const Review = require('../models/Review');
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
};