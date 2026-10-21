const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { protect, adminOnly } = require('../middleware/auth');

// Every ticket route requires login
router.use(protect);

// Create a ticket (any logged-in user)
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, category } = req.body;
    const ticket = await Ticket.create({
      title,
      description,
      priority,
      category,
      createdBy: req.user._id,
    });
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get tickets: admin sees all, staff sees only their own
router.get('/', async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { createdBy: req.user._id };
    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one ticket (owner or admin)
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isOwner =
      ticket.createdBy && ticket.createdBy._id.equals(req.user._id);
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a ticket (admin only: status, assignment, etc.)
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a ticket (admin only)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json({ message: 'Ticket deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;