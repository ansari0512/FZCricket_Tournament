const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyAdmin, verifyUser } = require('../middleware/auth');

const ADMIN_SECRET = process.env.ADMIN_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

// User Register
router.post('/register', async (req, res) => {
  try {
    const { mobile, username, password } = req.body;
    if (!mobile || !username || !password)
      return res.status(400).json({ message: 'All fields required' });
    if (!/^[0-9]{10}$/.test(mobile))
      return res.status(400).json({ message: 'Mobile 10 digit ka hona chahiye' });
    if (username.trim().length < 3 || username.trim().length > 30)
      return res.status(400).json({ message: 'Username 3 se 30 characters ke beech hona chahiye' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password kam se kam 6 characters ka hona chahiye' });

    const existing = await User.findOne({ $or: [{ mobile }, { username }] });
    if (existing)
      return res.status(400).json({ message: existing.mobile === mobile ? 'Mobile already registered' : 'Username already taken' });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ mobile, username, password: hashed });
    await user.save();

    const token = jwt.sign({ userId: user._id, username }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'Registration successful', token, user: { _id: user._id, username, mobile } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ $or: [{ username }, { mobile: username }] });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Wrong password' });

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, user: { _id: user._id, username: user.username, mobile: user.mobile, teamId: user.teamId } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Notifications
router.get('/notifications/:userId', verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.notifications.sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notifications read
router.put('/notifications/:userId/read', verifyUser, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { $set: { 'notifications.$[].read': true } });
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username !== 'admin' || password !== ADMIN_SECRET)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ message: 'Login successful', token, role: 'admin' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User change password
router.put('/change-password/:userId', verifyUser, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) return res.status(401).json({ message: 'Old password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin - Reset user credentials
router.put('/admin/users/:userId/reset', verifyAdmin, async (req, res) => {
  try {
    const { newUsername, newPassword } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (newUsername) {
      const existing = await User.findOne({ username: newUsername, _id: { $ne: req.params.userId } });
      if (existing) return res.status(400).json({ message: 'Username already taken' });
      user.username = newUsername;
    }
    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
    }
    await user.save();
    res.json({ message: 'Credentials reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin - Get all users
router.get('/admin/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin - Delete user
router.delete('/admin/users/:userId', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.teamId) {
      await require('../models/Player').deleteMany({ teamId: user.teamId });
      await require('../models/Team').findByIdAndDelete(user.teamId);
    }
    await User.findByIdAndDelete(req.params.userId);
    res.json({ message: 'User and associated data deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
