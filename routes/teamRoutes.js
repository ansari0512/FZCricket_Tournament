const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Player = require('../models/Player');
const Payment = require('../models/Payment');

const MAX_TEAMS = 8;
const REGISTRATION_FEE = 300;

router.get('/count', async (req, res) => {
  try {
    const count = await Team.countDocuments({ status: 'approved' });
    res.json({ count, maxTeams: MAX_TEAMS, isFull: count >= MAX_TEAMS });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const teams = await Team.find({ status: 'approved' }).sort({ registrationDate: -1 });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    
    const players = await Player.find({ teamId: team._id });
    res.json({ team, players });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/players', async (req, res) => {
  try {
    const players = await Player.find({ teamId: req.params.id });
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/register', async (req, res) => {
  try {
    const teamCount = await Team.countDocuments({ status: 'approved' });
    if (teamCount >= MAX_TEAMS) {
      return res.status(400).json({ message: 'Registration is closed. All 8 teams have registered.' });
    }

    const { teamName, captainName, captainPhone, city, paymentId } = req.body;

    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team name already exists' });
    }

    const team = new Team({
      teamName,
      captainName,
      captainPhone,
      city,
      paymentStatus: paymentId ? true : false,
      paymentId,
      status: paymentId ? 'approved' : 'pending',
      players: []
    });

    await team.save();
    res.status(201).json({ message: 'Team registered successfully', team });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    await Player.deleteMany({ teamId: req.params.id });
    res.json({ message: 'Team deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/leaderboard/all', async (req, res) => {
  try {
    const teams = await Team.find({ status: 'approved' })
      .sort({ points: -1, wins: -1 })
      .limit(10);
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
