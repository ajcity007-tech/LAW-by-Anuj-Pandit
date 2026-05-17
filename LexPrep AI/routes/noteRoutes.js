const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');
const { validateNote, validateIdParam } = require('../middleware/validateMiddleware');

router.get('/', optionalAuth, noteController.getAllNotes);
router.get('/search', optionalAuth, noteController.searchNotes);
router.get('/:id', optionalAuth, validateIdParam, noteController.getNoteById);
router.post('/', authMiddleware, validateNote, noteController.createNote);
router.put('/:id', authMiddleware, validateIdParam, noteController.updateNote);
router.patch('/:id/bookmark', authMiddleware, validateIdParam, noteController.toggleBookmark);
router.delete('/:id', authMiddleware, validateIdParam, noteController.deleteNote);

module.exports = router;
