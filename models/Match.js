const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true,
    unique: true
  },
  team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  matchDate: {
    type: Date,
    required: true
  },
  matchType: {
    type: String,
    enum: ['group', 'semi-final', 'final'],
    default: 'group'
  },
  overs: {
    type: Number,
    default: 8
  },
  venue: {
    type: String,
    default: 'Odajhar Village'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed'],
    default: 'scheduled'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    default: null
  },
  team1Score: {
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    overs: { type: Number, default: 0 }
  },
  team2Score: {
    runs: { type: Number, default: 0 },
    wickets: { type: Number, default: 0 },
    overs: { type: Number, default: 0 }
  },
  currentInnings: {
    batting: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    bowling: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    currentOver: { type: Number, default: 0 },
    currentBall: { type: Number, default: 0 },
    target: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

matchSchema.index({ matchDate: 1 });
matchSchema.index({ status: 1 });

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;