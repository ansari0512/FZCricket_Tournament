const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

router.get('/match/:matchId', async (req, res) => {
  try {
    const scores = await Score.find({ matchId: req.params.matchId }).sort({ timestamp: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { matchId, over, ball, batsmanId, bowlerId, runs, isWicket, wicketType } = req.body;

    const score = new Score({
      matchId,
      over,
      ball,
      batsmanId,
      bowlerId,
      runs,
      isWicket,
      wicketType
    });

    await score.save();
    res.status(201).json({ message: 'Score updated', score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/latest/:matchId', async (req, res) => {
  try {
    const score = await Score.findOne({ matchId: req.params.matchId }).sort({ timestamp: -1 });
    res.json(score);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;