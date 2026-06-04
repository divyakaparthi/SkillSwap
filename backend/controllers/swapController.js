const SwapRequest = require('../models/SwapRequest');
const User = require('../models/User');

// Send swap request
exports.sendRequest = async (req, res, next) => {
  try {
    const { senderSkill, receiverSkill, message } = req.body;
    const receiver = await User.findById(req.params.userId);
    if (!receiver) return res.status(404).json({ success: false, message: 'User not found' });
    if (req.user._id.equals(receiver._id))
      return res.status(400).json({ success: false, message: 'Cannot send request to yourself' });

    const request = await SwapRequest.create({
      sender: req.user._id,
      receiver: receiver._id,
      senderSkill, receiverSkill, message
    });

    const populated = await request.populate('sender receiver', 'name avatar college skillsHave skillsWant');
    res.status(201).json({ success: true, request: populated });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ success: false, message: 'Request already sent!' });
    next(err);
  }
};

// Get received requests
exports.getReceivedRequests = async (req, res, next) => {
  try {
    const requests = await SwapRequest.find({ receiver: req.user._id, status: 'pending' })
      .populate('sender', 'name avatar college year skillsHave skillsWant')
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) { next(err); }
};

// Get sent requests
exports.getSentRequests = async (req, res, next) => {
  try {
    const requests = await SwapRequest.find({ sender: req.user._id })
      .populate('receiver', 'name avatar college year skillsHave skillsWant')
      .sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (err) { next(err); }
};

// Accept request
exports.acceptRequest = async (req, res, next) => {
  try {
    const request = await SwapRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (!request.receiver.equals(req.user._id))
      return res.status(403).json({ success: false, message: 'Not authorized' });

    request.status = 'accepted';
    await request.save();

    // Add to connections
    await User.findByIdAndUpdate(request.sender, { $addToSet: { connections: request.receiver } });
    await User.findByIdAndUpdate(request.receiver, { $addToSet: { connections: request.sender } });

    res.json({ success: true, message: 'Request accepted! You are now connected.' });
  } catch (err) { next(err); }
};

// Decline request
exports.declineRequest = async (req, res, next) => {
  try {
    const request = await SwapRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    if (!request.receiver.equals(req.user._id))
      return res.status(403).json({ success: false, message: 'Not authorized' });

    request.status = 'declined';
    await request.save();
    res.json({ success: true, message: 'Request declined' });
  } catch (err) { next(err); }
};

// Get request status between two users
exports.getRequestStatus = async (req, res, next) => {
  try {
    const request = await SwapRequest.findOne({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    });
    res.json({ success: true, request });
  } catch (err) { next(err); }
};