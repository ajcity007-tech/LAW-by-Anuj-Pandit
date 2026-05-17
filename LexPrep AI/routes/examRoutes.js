const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');
const { validateExamSubmit } = require('../middleware/validateMiddleware');
const Test = require('../models/Test');

router.get('/list', optionalAuth, (req, res) => {
  try {
    const filters = {
      exam_type: req.query.exam_type,
      subject: req.query.subject,
      is_active: true
    };
    const tests = Test.findAll(filters);
    res.json({ success: true, data: tests, count: tests.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tests', details: err.message });
  }
});

router.post('/start', authMiddleware, examController.startExam);
router.post('/submit', authMiddleware, validateExamSubmit, examController.submitExam);
router.get('/results', authMiddleware, examController.getExamResults);

module.exports = router;
