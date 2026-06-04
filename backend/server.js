const express      = require('express');
const http         = require('http');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const dotenv       = require('dotenv');
const connectDB    = require('./config/db');
const { initSocket } = require('./socket/socket');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter  = require('./middleware/rateLimiter');

dotenv.config();
connectDB();

const app    = express();
const server = http.createServer(app);
initSocket(server);

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/', rateLimiter);

app.use('/api/auth',    require('./routes/auth'));
app.use('/api/users',   require('./routes/users'));
app.use('/api/matches', require('./routes/matches'));
app.use('/api/chat',    require('./routes/chat'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/swap', require('./routes/swap'));

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));
// Temporary debug - add this line
app.use((err, req, res, next) => {
  console.log('ERROR DETAILS:', err);
  next(err);
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log('Server running on port ' + PORT));
