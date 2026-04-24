const express = require('express');
const router = express.Router();
const Score = require('../models/Score');
const { verifyAdmin } = require('../middleware/auth');

router.get('/match/:matchId', async (req, res) => {
  try {
    const scores = await Score.find({ matchId: req.params.matchId }).sort({ timestamp: -1 });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/update', verifyAdmin, async (req, res) => {
  try {
    const { matchId, over, ball, batsmanId, bowlerId, runs, isWicket, wicketType } = req.body;

    if (!matchId || over === undefined || ball === undefined || runs === undefined)
      return res.status(400).json({ message: 'matchId, over, ball aur runs required hain' });
    if (runs < 0 || runs > 6)
      return res.status(400).json({ message: 'Runs 0 se 6 ke beech hone chahiye' });

    const score = new Score({ matchId, over, ball, batsmanId, bowlerId, runs, isWicket, wicketType });
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