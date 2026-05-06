const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Player = require('../models/Player');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { verifyAdmin, verifyUser, verifyAuth } = require('../middleware/auth');

const MAX_TEAMS = 8;
const REGISTRATION_FEE = 1100; // Total fee: 300 advance + 800 on first match
const ADVANCE_PAYMENT = 300;
const REMAINING_PAYMENT = 800;

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

router.post('/register', verifyUser, async (req, res) => {
  try {
    const approvedCount = await Team.countDocuments({ status: 'approved', paymentDone: true });
    if (approvedCount >= MAX_TEAMS)
      return res.status(400).json({ message: 'Registration is closed. All 8 teams have registered.' });

    const { teamName, captainName, captainPhone, city } = req.body;

    if (!teamName || !captainName || !captainPhone || !city)
      return res.status(400).json({ message: 'teamName, captainName, captainPhone, and city are required' });
    if (teamName.trim().length < 3 || teamName.trim().length > 50)
      return res.status(400).json({ message: 'Team name must be between 3 and 50 characters' });
    if (captainName.trim().length < 3 || captainName.trim().length > 50)
      return res.status(400).json({ message: 'Captain name must be between 3 and 50 characters' });
    if (!/^[0-9]{10}$/.test(captainPhone))
      return res.status(400).json({ message: 'Captain phone must be 10 digits' });

    const existingTeam = await Team.findOne({ teamName: teamName.trim() });
    if (existingTeam)
      return res.status(400).json({ message: 'Team name already exists' });

    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) return res.status(404).json({ message: 'User not found' });
    if (currentUser.teamId) return res.status(400).json({ message: 'Your team is already registered' });

    const team = new Team({ 
      teamName, captainName, captainPhone, city, 
      userId: currentUser._id, 
      status: 'pending',
      advancePaymentDone: false,
      remainingPaymentDone: false 
    });
    await team.save();

    await User.findByIdAndUpdate(currentUser._id, { teamId: team._id });

    // Notify admin about new team
    const io = req.app.get('io')
    if (io) io.emit('adminAlert', { type: 'newTeam', message: `New team registered: ${teamName}`, team: { teamName, captainName, captainPhone, city } })

    res.status(201).json({ 
      message: 'Team registered successfully. Please pay ₹300 advance fee to complete registration.', 
      team,
      advancePaymentDue: ADVANCE_PAYMENT,
      totalFee: REGISTRATION_FEE
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyAuth, async (req, res) => {
  try {
    const existingTeam = await Team.findById(req.params.id);
    if (!existingTeam) return res.status(404).json({ message: 'Team not found' });

    const isAdmin = req.user.role === 'admin';
    const isOwner = existingTeam.userId?.toString() === req.user.userId;
    if (!isAdmin && !isOwner) return res.status(403).json({ message: 'You can update only your own team' });

    const allowedUserFields = ['teamName', 'captainName', 'captainPhone', 'city', 'submitted', 'paymentScreenshot'];
    const updateData = isAdmin
      ? req.body
      : Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedUserFields.includes(key)));

    if (!isAdmin && req.body.status === 'pending' && existingTeam.status === 'rejected') {
      updateData.status = 'pending';
    }
    const { status, rejectReason, paymentDone } = updateData;

    // Track payment parts
    if (paymentDone && !existingTeam.advancePaymentDone) {
      updateData.advancePaymentDone = true;
      updateData.paymentScreenshot = req.body.paymentScreenshot || existingTeam.paymentScreenshot;
    }
    if (paymentDone && existingTeam.advancePaymentDone && !existingTeam.remainingPaymentDone) {
      updateData.remainingPaymentDone = true;
      updateData.paymentDone = true;
    }

    // Track payment parts - when approved and advance payment done, remaining becomes due
    if (status === 'approved' && existingTeam.advancePaymentDone && !existingTeam.remainingPaymentDone) {
      updateData.remainingPaymentDue = true;
    }

    // If paymentDone is being set to true, check which payment it is
    if (paymentDone && !existingTeam.paymentDone) {
      if (!existingTeam.advancePaymentDone) {
        updateData.advancePaymentDone = true;
        updateData.remainingPaymentDone = false;
      } else if (existingTeam.advancePaymentDone && !existingTeam.remainingPaymentDone) {
        updateData.remainingPaymentDone = true;
        updateData.paymentDone = true; // Full payment complete
      }
    }

    const team = await Team.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!team) return res.status(404).json({ message: 'Team not found' });

    // Send notification to user
    if (team.userId) {
      let msg = '', type = 'info';
      if (status === 'approved') {
        msg = `🎉 Congratulations! Your team "${team.teamName}" has been approved! Please pay ₹300 advance fee to complete registration.`;
        type = 'success';
      } else if (status === 'rejected') {
        msg = `❌ Your team "${team.teamName}" has been rejected. Reason: ${rejectReason || 'Not specified'}`;
        type = 'error';
      } else if (paymentDone) {
        msg = `✅ Payment confirmed! Your team "${team.teamName}" is now officially registered.`;
        type = 'success';
      } else if (req.body.paymentScreenshot) {
        msg = `📸 Payment screenshot for "${team.teamName}" has been uploaded. Please verify.`;
        type = 'info';
        console.log(`[ADMIN ALERT] Team ${team.teamName} has uploaded a payment screenshot`);
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
