const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Team = require('../models/Team');

const MAX_PLAYERS = 15;

router.post('/register/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const { name, age, jerseyNumber, role, phone, photo, address } = req.body;

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

router.delete('/:id', async (req, res) => {
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