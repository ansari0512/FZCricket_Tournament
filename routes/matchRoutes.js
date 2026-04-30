const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Team = require('../models/Team');
const { verifyAdmin } = require('../middleware/auth');

const getResultUpdates = (match, winnerId, direction) => {
  const team1Id = match.team1;
  const team2Id = match.team2;
  const updates = [
    { id: team1Id, inc: { matchesPlayed: direction } },
    { id: team2Id, inc: { matchesPlayed: direction } }
  ];

  if (winnerId) {
    const loserId = winnerId.toString() === team1Id.toString() ? team2Id : team1Id;
    updates.push({ id: winnerId, inc: { wins: direction, points: 2 * direction } });
    updates.push({ id: loserId, inc: { losses: direction } });
  } else {
    updates.push({ id: team1Id, inc: { draws: direction, points: direction } });
    updates.push({ id: team2Id, inc: { draws: direction, points: direction } });
  }

  return updates;
};

const applyTeamResult = async (match, winnerId, direction) => {
  const updates = getResultUpdates(match, winnerId, direction);
  for (const update of updates) {
    await Team.findByIdAndUpdate(update.id, { $inc: update.inc });
  }
};

router.get('/', async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('team1', 'teamName')
      .populate('team2', 'teamName')
      .populate('winner', 'teamName')
      .sort({ matchDate: 1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const now = new Date();
    const matches = await Match.find({ 
      matchDate: { $gte: now },
      status: 'scheduled'
    })
      .populate('team1', 'teamName')
      .populate('team2', 'teamName')
      .sort({ matchDate: 1 })
      .limit(5);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/live', async (req, res) => {
  try {
    const match = await Match.findOne({ status: 'in-progress' })
      .populate('team1', 'teamName')
      .populate('team2', 'teamName');
    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/completed', async (req, res) => {
  try {
    const matches = await Match.find({ status: 'completed' })
      .populate('team1', 'teamName')
      .populate('team2', 'teamName')
      .populate('winner', 'teamName')
      .sort({ matchDate: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('team1', 'teamName')
      .populate('team2', 'teamName')
      .populate('winner', 'teamName');
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/create', verifyAdmin, async (req, res) => {
  try {
    const { team1Id, team2Id, matchDate, matchType, overs, venue } = req.body;

    if (!team1Id || !team2Id || !matchDate || !matchType)
      return res.status(400).json({ message: 'team1Id, team2Id, matchDate aur matchType required hain' });
    if (team1Id === team2Id)
      return res.status(400).json({ message: 'Team1 aur Team2 alag honi chahiye' });
    const validTypes = ['group', 'semi-final', 'final'];
    if (!validTypes.includes(matchType))
      return res.status(400).json({ message: 'matchType group, semi-final ya final hona chahiye' });

    const team1 = await Team.findById(team1Id);
    const team2 = await Team.findById(team2Id);
    if (!team1 || !team2)
      return res.status(404).json({ message: 'Team not found' });

    const matchCount = await Match.countDocuments() + 1;
    const match = new Match({
      matchId: `MATCH-${matchCount}`,
      team1: team1Id,
      team2: team2Id,
      matchDate,
      matchType,
      overs: overs || (matchType === 'final' ? 10 : 8),
      venue: venue || 'Odajhar Village',
      status: 'scheduled'
    });

    await match.save();
    res.status(201).json({ message: 'Match created successfully', match });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status, winnerId } = req.body;
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    const wasCompleted = match.status === 'completed';
    if (wasCompleted) {
      await applyTeamResult(match, match.winner, -1);
    }

    match.status = status;
    match.winner = status === 'completed' ? (winnerId || null) : null;
    await match.save();

    if (status === 'completed') {
      await applyTeamResult(match, match.winner, 1);
    }

    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/score', verifyAdmin, async (req, res) => {
  try {
    const { team1Score, team2Score } = req.body;
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      { team1Score, team2Score },
      { new: true }
    );
    res.json(match);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Match.findByIdAndDelete(req.params.id);
    res.json({ message: 'Match deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/generate-schedule', verifyAdmin, async (req, res) => {
  res.status(410).json({ message: 'Auto schedule disabled. Please create matches manually.' });
});

module.exports = router;
