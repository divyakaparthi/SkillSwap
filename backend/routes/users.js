const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getUser, updateProfile, uploadAvatar, getConnections, searchUsers, getLeaderboard } = require('../controllers/userController');

router.get('/leaderboard', protect, getLeaderboard);
router.get('/search', protect, searchUsers);
router.get('/connections', protect, getConnections);
router.get('/:id', protect, getUser);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, upload.single('avatar'), uploadAvatar);
module.exports = router;