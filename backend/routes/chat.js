const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getConversations, getHistory, sendMessage, markRead } = require('../controllers/chatController');
router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getHistory);
router.post('/:userId', protect, sendMessage);
router.patch('/:userId/read', protect, markRead);
module.exports = router;