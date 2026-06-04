const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createReview, getReviews } = require('../controllers/reviewController');
router.post('/:userId', protect, createReview);
router.get('/:userId', protect, getReviews);
module.exports = router;