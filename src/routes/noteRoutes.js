
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



// // ================= UPDATE NOTE =================
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const noteId = req.params.id;

    // 1️⃣ FIND NOTE FIRST
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        message: 'Note not found',
      });
    }

    // 2️⃣ CHECK OWNERSHIP
    if (note.user.toString() !== req.userId) {
      return res.status(403).json({
        message: 'You are not allowed to update this note',
      });
    }

    // 3️⃣ UPDATE FIELDS
    const { title, content, tag, isPinned } = req.body;

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tag !== undefined) note.tag = tag;
    if (isPinned !== undefined) note.isPinned = isPinned;

    // 4️⃣ SAVE
    const updatedNote = await note.save();

    res.status(200).json({
      message: 'Note updated successfully',
      note: updatedNote,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
    });
  }
});

// ================= Delete NOTE =================
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const noteId = req.params.id;

    // 1️⃣ find note
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({
        message: 'Note not found',
      });
    }

    // 2️⃣ ownership check
    if (note.user.toString() !== req.userId) {
      return res.status(403).json({
        message: 'You are not allowed to delete this note',
      });
    }

    // 3️⃣ delete note
    await note.deleteOne();

    res.status(200).json({
      message: 'Note deleted successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
    });
  }
});

module.exports = router;
