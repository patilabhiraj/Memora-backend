
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const authMiddleware = require('../middleware/authMiddleware');

// ================= CREATE NOTE =================
router.post('/', authMiddleware, async (req, res) => {
  const { title, content, tag, isPinned } = req.body;
  // 1️⃣ create note FIRST
  const note = await Note.create({
    title,
    content,
    tag,
    isPinned,
    user: req.userId,
  });

  res.status(201).json({
    message: 'Note created successfully',
    note,
  });
});

// ================= GET MY NOTES =================
router.get('/', authMiddleware, async (req, res) => {
  const notes = await Note.find({ user: req.userId }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    count: notes.length,
    notes,
  });
});

module.exports = router;
