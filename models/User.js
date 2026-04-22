const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  mobile: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  notifications: [{
    message: { type: String },
    type: { type: String, enum: ['info', 'success', 'error', 'warning'] },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24*60*60*1000) }
});

// Auto delete user after 24hrs if no team registered
userSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { teamId: null } });

module.exports = mongoose.model('User', userSchema);
