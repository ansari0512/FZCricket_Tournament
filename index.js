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

const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection - uncomment when MongoDB is installed
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fz_cricket', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch(err => console.log('MongoDB connection error:', err));

console.log('Note: MongoDB not connected - using demo data mode');

app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/players', require('./routes/playerRoutes'));
app.use('/api/scores', require('./routes/scoreRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

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
    io.emit('scoreUpdate', data);
  });

  socket.on('matchStatusChange', (data) => {
    io.emit('matchStatusChange', data);
  });

  socket.on('disconnect', () => {
    connectedClients.delete(socket.id);
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = 5002;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});