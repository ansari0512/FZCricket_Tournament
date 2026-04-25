const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['https://fzcricket-tournament.netlify.app', 'https://fz-cricket-tournament.vercel.app', 'http://localhost:5173'];

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FZCricket API is running' });
});

const connectedClients = new Set();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  connectedClients.add(socket.id);

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
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});