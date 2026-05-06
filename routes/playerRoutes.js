const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Team = require('../models/Team');
const { verifyAuth, verifyAdmin } = require('../middleware/auth');

const MAX_PLAYERS = 15;

const canManageTeam = (req, team) => {
  return req.user.role === 'admin' || team.userId?.toString() === req.user.userId;
};

router.post('/register/:teamId', verifyAuth, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { name, age, jerseyNumber, role, phone, photo, address } = req.body;

    if (!name || !jerseyNumber || !role)
      return res.status(400).json({ message: 'name, jerseyNumber, and role are required' });
    if (name.trim().length < 2 || name.trim().length > 50)
      return res.status(400).json({ message: 'Player name must be between 2 and 50 characters' });
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 60)
      return res.status(400).json({ message: 'Age must be between 10 and 60' });
    const jerseyNum = Number(jerseyNumber);
    if (isNaN(jerseyNum) || jerseyNum < 1 || jerseyNum > 99)
      return res.status(400).json({ message: 'Jersey number must be between 1 and 99' });
    const validRoles = ['batsman', 'bowler', 'all-rounder', 'wicket-keeper'];
    if (!validRoles.includes(role))
      return res.status(400).json({ message: 'Role must be batsman, bowler, all-rounder, or wicket-keeper' });
    if (phone && !/^[0-9]{10}$/.test(phone))
      return res.status(400).json({ message: 'Phone must be 10 digits' });
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (!canManageTeam(req, team)) return res.status(403).json({ message: 'You can add players only to your own team' });

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

router.put('/:id', verifyAuth, async (req, res) => {
  try {
    const existingPlayer = await Player.findById(req.params.id);
    if (!existingPlayer) return res.status(404).json({ message: 'Player not found' });
    const team = await Team.findById(existingPlayer.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (!canManageTeam(req, team)) return res.status(403).json({ message: 'You can update players only in your own team' });

    const allowedFields = ['name', 'age', 'jerseyNumber', 'role', 'phone', 'photo', 'address'];
    const updateData = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
    const player = await Player.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(player);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const { reason } = req.body
    const player = await Player.findById(req.params.id)
    if (!player) return res.status(404).json({ message: 'Player not found' })

    const team = await Team.findById(player.teamId).populate('userId')
    await Player.findByIdAndDelete(req.params.id)

    // User ko notification bhejo
    if (team?.userId) {
      const User = require('../models/User')
      const msg = reason
        ? `Player "${player.name}" deleted by admin. Reason: ${reason}`
        : `Player "${player.name}" has been deleted by admin.`
      await User.findByIdAndUpdate(team.userId._id || team.userId, {
        $push: { notifications: { message: msg, type: 'error' } }
      })
      const io = req.app.get('io')
      if (io) io.emit('dataUpdate', { type: 'playerDeleted' })
    }

    res.json({ message: 'Player deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});

router.post('/bulk-register/:teamId', verifyAuth, async (req, res) => {
  try {
    const { teamId } = req.params;
    const { players } = req.body;

    if (!Array.isArray(players) || players.length === 0)
      return res.status(400).json({ message: 'Players array is required' });
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    if (!canManageTeam(req, team)) return res.status(403).json({ message: 'You can add players only to your own team' });

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
