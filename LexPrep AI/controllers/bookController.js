const Book = require('../models/Book');

function getAllBooks(req, res) {
  try {
    const filters = {
      subject: req.query.subject,
      exam_tag: req.query.exam_tag,
      semester: req.query.semester ? parseInt(req.query.semester) : null,
      search: req.query.search
    };

    const books = Book.findAll(filters);
    res.json({ success: true, data: books, count: books.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch books', details: err.message });
  }
}

function getBookById(req, res) {
  try {
    const book = Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    const chapters = Book.getChapters(req.params.id);
    res.json({ success: true, data: { ...book, chapters } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch book', details: err.message });
  }
}

function searchBooks(req, res) {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query is required' });

    const results = Book.searchFTS(q);
    res.json({ success: true, data: results, count: results.length });
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
}

function createBook(req, res) {
  try {
    const book = Book.create(req.body);
    res.status(201).json({ success: true, data: book });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create book', details: err.message });
  }
}

function deleteBook(req, res) {
  try {
    Book.delete(req.params.id);
    res.json({ success: true, message: 'Book deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete book', details: err.message });
  }
}

module.exports = { getAllBooks, getBookById, searchBooks, createBook, deleteBook };
