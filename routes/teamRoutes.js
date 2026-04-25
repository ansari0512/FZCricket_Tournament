const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Player = require('../models/Player');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { verifyAdmin, verifyUser } = require('../middleware/auth');

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

// Get only confirmed (approved + payment done) teams for public
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find({ status: 'approved', paymentDone: true }).sort({ registrationDate: -1 });
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all teams for admin
router.get('/all', verifyAdmin, async (req, res) => {
  try {
    const teams = await Team.find().sort({ registrationDate: -1 });
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
    const approvedCount = await Team.countDocuments({ status: 'approved', paymentDone: true });
    if (approvedCount >= MAX_TEAMS)
      return res.status(400).json({ message: 'Registration is closed. All 8 teams have registered.' });

    const { teamName, captainName, captainPhone, city, userId, firebaseUid } = req.body;

    if (!teamName || !captainName || !captainPhone || !city)
      return res.status(400).json({ message: 'teamName, captainName, captainPhone aur city required hain' });
    if (teamName.trim().length < 3 || teamName.trim().length > 50)
      return res.status(400).json({ message: 'Team name 3 se 50 characters ke beech hona chahiye' });
    if (captainName.trim().length < 3 || captainName.trim().length > 50)
      return res.status(400).json({ message: 'Captain name 3 se 50 characters ke beech hona chahiye' });
    if (!/^[0-9]{10}$/.test(captainPhone))
      return res.status(400).json({ message: 'Captain phone 10 digit ka hona chahiye' });

    const existingTeam = await Team.findOne({ teamName: teamName.trim() });
    if (existingTeam)
      return res.status(400).json({ message: 'Team name already exists' });

    // firebaseUid se user dhundho
    let dbUserId = userId || null
    if (firebaseUid) {
      const user = await User.findOne({ firebaseUid })
      if (user) dbUserId = user._id
    }

    const team = new Team({ teamName, captainName, captainPhone, city, userId: dbUserId, status: 'pending' });
    await team.save();

    if (dbUserId) {
      await User.findByIdAndUpdate(dbUserId, { teamId: team._id });
    }

    res.status(201).json({ message: 'Team registered successfully', team });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyUser, async (req, res) => {
  try {
    const { status, rejectReason, paymentDone } = req.body;
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Send notification to user
    if (team.userId) {
      let msg = '', type = 'info';
      if (status === 'approved') {
        msg = `🎉 Congratulations! Your team "${team.teamName}" has been approved! Please pay the registration fee of ₹1100 to confirm your spot.`;
        type = 'success';
      } else if (status === 'rejected') {
        msg = `❌ Your team "${team.teamName}" has been rejected. Reason: ${rejectReason || 'Not specified'}`;
        type = 'error';
      } else if (paymentDone) {
        msg = `✅ Payment confirmed! Your team "${team.teamName}" is now officially registered in the tournament.`;
        type = 'success';
      }
      if (msg) {
        await User.findByIdAndUpdate(team.userId, { $push: { notifications: { message: msg, type } } });
      }
    }

    res.json(team);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyAdmin, async (req, res) => {
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
