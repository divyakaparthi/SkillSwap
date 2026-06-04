const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  sendRequest, getReceivedRequests, getSentRequests,
  acceptRequest, declineRequest, getRequestStatus
} = require('../controllers/swapController');

router.post('/request/:userId', protect, sendRequest);
router.get('/received', protect, getReceivedRequests);
router.get('/sent', protect, getSentRequests);
router.put('/accept/:requestId', protect, acceptRequest);
router.put('/decline/:requestId', protect, declineRequest);
router.get('/status/:userId', protect, getRequestStatus);

module.exports = router;