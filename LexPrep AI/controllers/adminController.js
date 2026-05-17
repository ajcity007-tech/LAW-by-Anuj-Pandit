const Book = require('../models/Book');
const Topic = require('../models/Topic');
const Note = require('../models/Note');
const Question = require('../models/Question');
const Test = require('../models/Test');
const Flashcard = require('../models/Flashcard');
const User = require('../models/User');
const { getDb } = require('../models/database');

function getDashboardStats(req, res) {
  try {
    const db = getDb();

    const stats = {
      books: Book.getStats(),
      topics: Topic.getStats(),
      notes: Note.getStats(),
      questions: Question.getStats(),
      tests: Test.getStats(),
      flashcards: Flashcard.getStats(),
      users: {
        total: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
        byRole: db.prepare('SELECT role, COUNT(*) as count FROM users GROUP BY role').all()
      },
      recent_activity: {
        recent_tests: db.prepare('SELECT COUNT(*) as count FROM test_results WHERE completed_at > datetime("now", "-7 days")').get().count,
        recent_searches: db.prepare('SELECT COUNT(*) as count FROM search_logs WHERE created_at > datetime("now", "-7 days")').get().count,
        recent_chats: db.prepare('SELECT COUNT(*) as count FROM ai_chat_history WHERE created_at > datetime("now", "-7 days")').get().count
      }
    };

    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
  }
}

function createContent(req, res) {
  try {
    const { type, data } = req.body;

    if (!type || !data) {
      return res.status(400).json({ error: 'Type and data are required' });
    }

    let result;
    switch (type) {
      case 'book':
        result = Book.create(data);
        break;
      case 'topic':
        result = Topic.create(data);
        break;
      case 'note':
        result = Note.create(data);
        break;
      case 'question':
        result = Question.create(data);
        break;
      case 'flashcard':
        result = Flashcard.create(data);
        break;
      default:
        return res.status(400).json({ error: 'Invalid content type' });
    }

    res.status(201).json({ success: true, data: result, message: `${type} created successfully` });
  } catch (err) {
    res.status(500).json({ error: `Failed to create ${req.body.type}`, details: err.message });
  }
}

function bulkImport(req, res) {
  try {
    const { type, items } = req.body;

    if (!type || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Type and items array are required' });
    }

    const results = [];
    let errors = 0;

    items.forEach(item => {
      try {
        switch (type) {
          case 'book': results.push(Book.create(item)); break;
          case 'topic': results.push(Topic.create(item)); break;
          case 'note': results.push(Note.create(item)); break;
          case 'question': results.push(Question.create(item)); break;
          case 'flashcard': results.push(Flashcard.create(item)); break;
        }
      } catch (e) {
        errors++;
      }
    });

    res.json({
      success: true,
      data: { imported: results.length, errors, total: items.length },
      message: `Imported ${results.length} ${type}(s) with ${errors} errors`
    });
  } catch (err) {
    res.status(500).json({ error: 'Bulk import failed', details: err.message });
  }
}

function deleteContent(req, res) {
  try {
    const { type, id } = req.body;

    if (!type || !id) {
      return res.status(400).json({ error: 'Type and id are required' });
    }

    switch (type) {
      case 'book': Book.delete(id); break;
      case 'topic': Topic.delete(id); break;
      case 'note': Note.delete(id); break;
      case 'question': Question.delete(id); break;
      case 'test': Test.delete(id); break;
      case 'flashcard': Flashcard.delete(id); break;
      default:
        return res.status(400).json({ error: 'Invalid content type' });
    }

    res.json({ success: true, message: `${type} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: `Failed to delete ${req.body.type}`, details: err.message });
  }
}

function getSearchLogs(req, res) {
  try {
    const db = getDb();
    const limit = parseInt(req.query.limit) || 50;
    const logs = db.prepare('SELECT * FROM search_logs ORDER BY created_at DESC LIMIT ?').all(limit);
    const popularQueries = db.prepare('SELECT query, COUNT(*) as count FROM search_logs GROUP BY query ORDER BY count DESC LIMIT 20').all();

    res.json({ success: true, data: { logs, popular_queries: popularQueries } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch search logs', details: err.message });
  }
}

module.exports = { getDashboardStats, createContent, bulkImport, deleteContent, getSearchLogs };
