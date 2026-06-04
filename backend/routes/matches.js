const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getMatches, connect, disconnect } = require('../controllers/matchController');
router.get('/', protect, getMatches);
router.post('/connect/:userId', protect, connect);
router.delete('/connect/:userId', protect, disconnect);
module.exports = router;