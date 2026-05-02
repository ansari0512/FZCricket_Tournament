const express = require('express');
const router = express.Router();
const Config = require('../models/Config');
const { verifyAdmin } = require('../middleware/auth');

// GET /api/config - Get all config
router.get('/', verifyAdmin, async (req, res) => {
  try {
    const configs = await Config.find();
    res.json(configs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/config/payment - Get payment config (UPI IDs) - Public
router.get('/payment', async (req, res) => {
  try {
    const paymentConfig = await Config.find({
      key: { $in: ['UPI_GPAY', 'UPI_PHONEPE', 'UPI_PAYTM'] }
    });

    const configMap = {}
    paymentConfig.forEach(c => { configMap[c.key] = c.value })

    // If not in database, fallback to environment variables
    res.json({
      gpay: configMap['UPI_GPAY'] || process.env.UPI_GPAY || '',
      phonepe: configMap['UPI_PHONEPE'] || process.env.UPI_PHONEPE || '',
      paytm: configMap['UPI_PAYTM'] || process.env.UPI_PAYTM || ''
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/config - Create or update config (Admin only)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { key, value, description } = req.body;
    
    if (!key || !value) {
      return res.status(400).json({ error: 'Key and value are required' });
    }
    
    const config = await Config.findOneAndUpdate(
      { key },
      { value, description },
      { new: true, upsert: true }
    );
    
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/config/:id - Update config (Admin only)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { value, description } = req.body;
    
    const config = await Config.findByIdAndUpdate(
      req.params.id,
      { value, description },
      { new: true }
    );
    
    if (!config) {
      return res.status(404).json({ error: 'Config not found' });
    }
    
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/config/:id - Delete config (Admin only)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const config = await Config.findByIdAndDelete(req.params.id);
    
    if (!config) {
      return res.status(404).json({ error: 'Config not found' });
    }
    
    res.json({ message: 'Config deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;