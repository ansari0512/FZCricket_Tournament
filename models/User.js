const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, default: '' },
  photo: { type: String, default: '' },
  mobile: { type: String, default: '' },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: null },
  notifications: [{
    message: { type: String },
    type: { type: String, enum: ['info', 'success', 'error', 'warning'] },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', userSchema)
