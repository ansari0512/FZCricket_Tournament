const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Team = require('../models/Team');
const { verifyUser, verifyAdmin } = require('../middleware/auth');

const MAX_PLAYERS = 15;

router.post('/register/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const { name, age, jerseyNumber, role, phone, photo, address } = req.body;

    if (!name || !jerseyNumber || !role)
      return res.status(400).json({ message: 'name, jerseyNumber aur role required hain' });
    if (name.trim().length < 2 || name.trim().length > 50)
      return res.status(400).json({ message: 'Player name 2 se 50 characters ke beech hona chahiye' });
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 60)
      return res.status(400).json({ message: 'Age 10 se 60 ke beech hona chahiye' });
    const jerseyNum = Number(jerseyNumber);
    if (isNaN(jerseyNum) || jerseyNum < 1 || jerseyNum > 99)
      return res.status(400).json({ message: 'Jersey number 1 se 99 ke beech hona chahiye' });
    const validRoles = ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'];
    if (!validRoles.includes(role))
      return res.status(400).json({ message: 'Role batsman, bowler, all-rounder ya wicket-keeper hona chahiye' });
    if (phone && !/^[0-9]{10}$/.test(phone))
      return res.status(400).json({ message: 'Phone 10 digit ka hona chahiye' });
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const playerCount = await Player.countDocuments({ teamId });
    if (playerCount >= MAX_PLAYERS) return res.status(400).json({ message: 'Team already has 15 players' });

    const player = new Player({ teamId, name, age: age || 18, jerseyNumber, role, phone: phone || '', photo: photo || '', address: address || '' });
    await player.save();
    res.status(201).json({ message: 'Player registered successfully', player });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/team/:teamId', async (req, res) => {
  try {
    const players = await Player.find({ teamId: req.params.teamId });
    res.json(players);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/bulk-register/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const { players } = req.body;

    if (!Array.isArray(players) || players.length === 0)
      return res.status(400).json({ message: 'Players array required hai' });
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const currentCount = await Player.countDocuments({ teamId });
    if (currentCount + players.length > MAX_PLAYERS) {
      return res.status(400).json({ message: `Cannot add ${players.length} players. Max allowed: ${MAX_PLAYERS - currentCount}` });
    }

    const createdPlayers = [];
    for (const playerData of players) {
      const player = new Player({
        teamId,
        ...playerData
      });
      await player.save();
      createdPlayers.push(player);
    }

    res.status(201).json({ message: 'Players registered successfully', players: createdPlayers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;