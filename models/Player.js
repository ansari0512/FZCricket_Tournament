const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    default: 18
  },
  jerseyNumber: {
    type: Number,
    required: true
  },
  role: {
    type: String,
    enum: ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'],
    default: 'batsman'
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  photo: {
    type: String,
    default: ''
  },
  runsScored: {
    type: Number,
    default: 0
  },
  wicketsTaken: {
    type: Number,
    default: 0
  },
  matchesPlayed: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

playerSchema.index({ teamId: 1, jerseyNumber: 1 }, { unique: true });

module.exports = mongoose.model('Player', playerSchema);