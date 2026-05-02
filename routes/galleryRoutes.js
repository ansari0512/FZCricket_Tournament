const express = require('express')
const router = express.Router()
const Gallery = require('../models/Gallery')
const { verifyAdmin } = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 })
    res.json(photos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { url, caption } = req.body
    if (!url) return res.status(400).json({ message: 'URL is required' })
    const photo = new Gallery({ url, caption })
    await photo.save()
    res.status(201).json(photo)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id)
    res.json({ message: 'Photo deleted' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
