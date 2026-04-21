const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'fzadmin2026';

router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== 'admin' || password !== ADMIN_SECRET) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ username, role: 'admin' }, process.env.JWT_SECRET || 'fzsecret2026', { expiresIn: '24h' });
    res.json({ message: 'Login successful', token, role: 'admin' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/admin/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fzsecret2026');
    res.json({ valid: true, user: decoded });
  } catch (err) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
});

module.exports = router;