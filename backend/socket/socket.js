const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const roomId = (a, b) => [a, b].sort().join('_');
const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] },
  });
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth && socket.handshake.auth.token;
      const { id } = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = id;
      next();
    } catch (e) { next(new Error('Unauthorised')); }
  });
  io.on('connection', async (socket) => {
    await User.findByIdAndUpdate(socket.userId, { isOnline: true });
    socket.broadcast.emit('user:online', { userId: socket.userId });
    socket.on('chat:join', ({ peerId }) => socket.join(roomId(socket.userId, peerId)));
    socket.on('chat:message', async ({ peerId, text }) => {
      const room = roomId(socket.userId, peerId);
      const msg = await Message.create({ sender: socket.userId, receiver: peerId, roomId: room, text });
      const pop = await msg.populate('sender receiver', 'name avatar');
      io.to(room).emit('chat:message', pop);
    });
    socket.on('chat:typing', ({ peerId }) => socket.to(roomId(socket.userId, peerId)).emit('chat:typing', { userId: socket.userId }));
    socket.on('chat:stopTyping', ({ peerId }) => socket.to(roomId(socket.userId, peerId)).emit('chat:stopTyping', { userId: socket.userId }));
    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(socket.userId, { isOnline: false, lastSeen: new Date() });
      socket.broadcast.emit('user:offline', { userId: socket.userId });
    });
  });
};
module.exports = { initSocket };