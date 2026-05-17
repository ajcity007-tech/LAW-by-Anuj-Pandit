const express = require('express');
const router = express.Router();
const Topic = require('../models/Topic');
const { optionalAuth } = require('../middleware/authMiddleware');
const { validateTopic, validateIdParam } = require('../middleware/validateMiddleware');

router.get('/', optionalAuth, (req, res) => {
  try {
    const filters = {
      subject: req.query.subject,
      book_id: req.query.book_id,
      exam_tag: req.query.exam_tag,
      semester: req.query.semester ? parseInt(req.query.semester) : null,
      difficulty: req.query.difficulty,
      search: req.query.search
    };
    const topics = Topic.findAll(filters);
    res.json({ success: true, data: topics, count: topics.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch topics', details: err.message });
  }
});

router.get('/search', optionalAuth, (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query required' });
    const results = Topic.searchFTS(q);
    res.json({ success: true, data: results, count: results.length });
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

router.get('/:id', optionalAuth, validateIdParam, (req, res) => {
  try {
    const topic = Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ error: 'Topic not found' });
    const notes = Topic.getNotes(req.params.id);
    const questions = Topic.getQuestions(req.params.id);
    res.json({ success: true, data: { ...topic, notes, questions } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch topic', details: err.message });
  }
});

router.post('/', optionalAuth, validateTopic, (req, res) => {
  try {
    const topic = Topic.create(req.body);
    res.status(201).json({ success: true, data: topic });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create topic', details: err.message });
  }
});

router.delete('/:id', optionalAuth, validateIdParam, (req, res) => {
  try {
    Topic.delete(req.params.id);
    res.json({ success: true, message: 'Topic deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete topic', details: err.message });
  }
});

module.exports = router;
