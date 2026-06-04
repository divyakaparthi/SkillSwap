const Message = require('../models/Message');
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
};