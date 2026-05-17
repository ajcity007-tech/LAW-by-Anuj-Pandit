const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');
const { validateBook, validateIdParam } = require('../middleware/validateMiddleware');

router.get('/', optionalAuth, bookController.getAllBooks);
router.get('/search', optionalAuth, bookController.searchBooks);
router.get('/:id', optionalAuth, validateIdParam, bookController.getBookById);
router.post('/', authMiddleware, validateBook, bookController.createBook);
router.delete('/:id', authMiddleware, validateIdParam, bookController.deleteBook);

module.exports = router;
