const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  teamName: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rejectReason: {
    type: String,
    default: ''
  },
  paymentDone: {
    type: Boolean,
    default: false
  },
  submitted: {
    type: Boolean,
    default: false
  },
  paymentScreenshot: {
    type: String,
    default: ''
  },
  captainName: {
    type: String,
    required: true
  },
  captainPhone: {
    type: String,
    required: true
  },
  city: {
    type: String,
    default: 'Odajhar'
  },
  logo: {
    type: String,
    default: ''
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  // Payment tracking fields - Total: 1100 (300 advance + 800 on first match)
  advancePayment: {
    type: Number,
    default: 300
  },
  remainingPayment: {
    type: Number,
    default: 800
  },
  advancePaymentDone: {
    type: Boolean,
    default: false
  },
  remainingPaymentDone: {
    type: Boolean,
    default: false
  },
  firstMatchDate: {
    type: Date,
    default: null
  },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  wins: {
    type: Number,
    default: 0
  },
  losses: {
    type: Number,
    default: 0
  },
  draws: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  matchesPlayed: {
    type: Number,
    default: 0
  },
  netRunRate: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Team', teamSchema);