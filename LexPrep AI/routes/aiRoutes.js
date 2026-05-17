const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');
const { validateAIChat } = require('../middleware/validateMiddleware');

router.post('/chat', optionalAuth, validateAIChat, aiController.chatWithAI);
router.post('/summary', optionalAuth, aiController.generateSummary);
router.post('/mocktest', optionalAuth, aiController.generateMockTest);

module.exports = router;
