const express = require('express');
const router = express.Router({ mergeParams: true });
const Ticket = require('../models/Ticket');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth');

router.use(protect);

// Finds the ticket and checks the user may access it (owner or admin)
async function getAllowedTicket(req, res) {
  const ticket = await Ticket.findById(req.params.ticketId);
  if (!ticket) {
    res.status(404).json({ message: 'Ticket not found' });
    return null;
  }
  const isOwner = ticket.createdBy && ticket.createdBy.equals(req.user._id);
  if (req.user.role !== 'admin' && !isOwner) {
    res.status(403).json({ message: 'Not allowed' });
    return null;
  }
  return ticket;
}

// Get comments of a ticket
router.get('/', async (req, res) => {
  try {
    const ticket = await getAllowedTicket(req, res);
    if (!ticket) return;
    const comments = await Comment.find({ ticket: ticket._id })
      .populate('author', 'name role')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a comment
router.post('/', async (req, res) => {
  try {
    const ticket = await getAllowedTicket(req, res);
    if (!ticket) return;
    const comment = await Comment.create({
      ticket: ticket._id,
      author: req.user._id,
      text: req.body.text,
    });
    await comment.populate('author', 'name role');
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;