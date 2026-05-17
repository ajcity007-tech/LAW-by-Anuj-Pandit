const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, (req, res) => {
  try {
    const filters = {
      subject: req.query.subject,
      exam_tag: req.query.exam_tag,
      semester: req.query.semester ? parseInt(req.query.semester) : null,
      difficulty: req.query.difficulty,
      search: req.query.search
    };
    const flashcards = Flashcard.findAll(filters);
    res.json({ success: true, data: flashcards, count: flashcards.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flashcards', details: err.message });
  }
});

router.get('/review', authMiddleware, (req, res) => {
  try {
    const cards = Flashcard.getDueForReview(req.user.id);
    res.json({ success: true, data: cards, count: cards.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch review cards', details: err.message });
  }
});

router.post('/:id/progress', authMiddleware, (req, res) => {
  try {
    const { quality } = req.body;
    if (quality === undefined || quality < 0 || quality > 5) {
      return res.status(400).json({ error: 'Quality must be between 0 and 5' });
    }
    const progress = Flashcard.updateProgress(req.user.id, req.params.id, quality);
    res.json({ success: true, data: progress });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update progress', details: err.message });
  }
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const card = Flashcard.create(req.body);
    res.status(201).json({ success: true, data: card });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create flashcard', details: err.message });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    Flashcard.delete(req.params.id);
    res.json({ success: true, message: 'Flashcard deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete flashcard', details: err.message });
  }
});

module.exports = router;
