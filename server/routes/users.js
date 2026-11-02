const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// List admins (for assigning tickets)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('name email role');
    res.json(admins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;