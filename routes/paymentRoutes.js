const express = require('express')
const router = express.Router()
const Payment = require('../models/Payment')
const { verifyAdmin } = require('../middleware/auth')

// Admin - Get all payments
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 })
    res.json(payments)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get payments for a team
router.get('/team/:teamId', async (req, res) => {
  try {
    const payments = await Payment.find({ teamId: req.params.teamId }).sort({ createdAt: -1 })
    res.json(payments)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
