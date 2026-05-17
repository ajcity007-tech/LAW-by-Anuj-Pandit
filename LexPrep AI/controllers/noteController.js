const Note = require('../models/Note');

function getAllNotes(req, res) {
  try {
    const filters = {
      subject: req.query.subject,
      exam_tag: req.query.exam_tag,
      semester: req.query.semester ? parseInt(req.query.semester) : null,
      topic_id: req.query.topic_id,
      search: req.query.search
    };

    const notes = Note.findAll(filters);
    res.json({ success: true, data: notes, count: notes.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notes', details: err.message });
  }
}

function getNoteById(req, res) {
  try {
    const note = Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch note', details: err.message });
  }
}

function createNote(req, res) {
  try {
    const note = Note.create(req.body);
    res.status(201).json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create note', details: err.message });
  }
}

function updateNote(req, res) {
  try {
    const note = Note.update(req.params.id, req.body);
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note', details: err.message });
  }
}

function toggleBookmark(req, res) {
  try {
    const note = Note.toggleBookmark(req.params.id);
    res.json({ success: true, data: { id: note.id, is_bookmarked: note.is_bookmarked } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle bookmark', details: err.message });
  }
}

function deleteNote(req, res) {
  try {
    Note.delete(req.params.id);
    res.json({ success: true, message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note', details: err.message });
  }
}

function searchNotes(req, res) {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Search query is required' });
    const results = Note.searchFTS(q);
    res.json({ success: true, data: results, count: results.length });
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
}

module.exports = { getAllNotes, getNoteById, createNote, updateNote, toggleBookmark, deleteNote, searchNotes };
