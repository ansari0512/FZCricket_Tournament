const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { verifyAdmin, verifyUser } = require('../middleware/auth')
const admin = require('../middleware/firebaseAdmin') // 🔥 ADD THIS

const JWT_SECRET = process.env.JWT_SECRET

// 🔥 GOOGLE LOGIN (FIXED WITH FIREBASE TOKEN)
router.post('/google-login', async (req, res) => {
  try {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ message: 'Firebase token required' })
    }

    // ✅ VERIFY FIREBASE TOKEN
    const decoded = await admin.auth().verifyIdToken(token)

    const firebaseUid = decoded.uid
    const email = decoded.email
    const name = decoded.name || ''
    const photo = decoded.picture || ''

    let user = await User.findOne({ firebaseUid })

    if (!user) {
      // New user
      user = new User({
        firebaseUid,
        email,
        name,
        photo
      })
      await user.save()
    } else {
      // Update existing
      user.name = name || user.name
      user.photo = photo || user.photo
      await user.save()
    }

    // Populate team details
    const userWithTeam = await User.findById(user._id).populate(
      'teamId',
      'teamName status paymentDone captainName city'
    )

    // ✅ GENERATE JWT
    const jwtToken = jwt.sign(
      {
        userId: userWithTeam._id.toString(),
        firebaseUid,
        email,
        role: 'user'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      user: userWithTeam,
      token: jwtToken
    })

  } catch (err) {
    console.error('Google login error:', err.message, err.code)
    res.status(500).json({ message: 'Authentication failed', detail: err.message })
  }
})

// Get current user
router.get('/me', verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate(
      'teamId',
      'teamName status paymentDone captainName city'
    )
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Notifications
router.get('/notifications', verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user.notifications.sort((a, b) => b.createdAt - a.createdAt))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.put('/notifications/read', verifyUser, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.userId, {
      $set: { 'notifications.$[].read': true }
    })
    res.json({ message: 'Marked as read' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (username !== 'admin' || password !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({ message: 'Login successful', token, role: 'admin' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin users
router.get('/admin/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/admin/users/:userId', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    if (user.teamId) {
      const Player = require('../models/Player')
      const Team = require('../models/Team')

      await Player.deleteMany({ teamId: user.teamId })
      await Team.findByIdAndDelete(user.teamId)
    }

    await User.findByIdAndDelete(req.params.userId)
    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
