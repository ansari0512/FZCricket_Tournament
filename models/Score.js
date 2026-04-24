const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  over: {
    type: Number,
    required: true
  },
  ball: {
    type: Number,
    required: true
  },
  batsmanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  bowlerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
  runs: {
    type: Number,
    default: 0
  },
  isWicket: {
    type: Boolean,
    default: false
  },
  wicketType: {
    type: String,
    enum: ['bowled', 'caught', 'lbw', 'stumped', 'run-out', null],
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Score', scoreSchema);