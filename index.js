const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

dotenv.config();

const app = express();
const server = http.createServer(app);

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['https://fz-cricket-tournament.vercel.app', 'http://localhost:5173'];

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later.' }
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts, please try again later.' }
});
app.use('/api/', limiter);
app.use('/api/auth/admin/login', authLimiter);

const io = socketIo(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"]
  }
});

app.use(cors({
  origin: ALLOWED_ORIGINS,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(mongoSanitize()); // NoSQL injection se bachao
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/players', require('./routes/playerRoutes'));
app.use('/api/scores', require('./routes/scoreRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/config', require('./routes/configRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FZCricket API is running' });
});

const connectedClients = new Set();

// Add admin clients for broadcasting
const adminClients = new Set();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  connectedClients.add(socket.id);

  // Register as admin client for updates
  socket.on('registerAdmin', () => {
    adminClients.add(socket.id);
    console.log('Admin client registered:', socket.id);
  });

  socket.on('joinMatch', (matchId) => {
    socket.join(`match-${matchId}`);
    console.log(`Client ${socket.id} joined match ${matchId}`);
  });

  socket.on('leaveMatch', (matchId) => {
    socket.leave(`match-${matchId}`);
  });

  socket.on('scoreUpdate', (data) => {
    io.to(`match-${data.matchId}`).emit('scoreUpdate', data);
  });

  socket.on('matchStatusChange', (data) => {
    io.emit('matchStatusChange', data);
  });

  socket.on('disconnect', () => {
    connectedClients.delete(socket.id);
    adminClients.delete(socket.id);
    console.log('Client disconnected:', socket.id);
  });
});

// Broadcast update to all connected clients
const broadcastUpdate = (type, data) => {
  io.emit('dataUpdate', { type, data, timestamp: Date.now() });
  console.log('Broadcasted  update to all clients');
};

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
