const { getDb } = require('../models/database');
const Note = require('../models/Note');
const Topic = require('../models/Topic');
const Book = require('../models/Book');
const Doctrine = require('../models/Doctrine');
const LandmarkCase = require('../models/LandmarkCase');
const Section = require('../models/Section');

function getDashboardData(req, res) {
  try {
    const db = getDb();

    const bookStats = Book.getStats();
    const topicStats = Topic.getStats();
    const noteStats = Note.getStats();
    const doctrineStats = Doctrine.getStats();
    const caseStats = LandmarkCase.getStats();
    const sectionStats = Section.getStats();

    const subjects = db.prepare('SELECT DISTINCT subject FROM books ORDER BY subject').all();
    const examTypes = ['UP PCS-J', 'Judicial Services', 'Civil Judge', 'Bar Exam', 'APO', 'UPSC', 'LLB'];

    const recentNotes = db.prepare(`
      SELECT n.*, t.title as topic_title
      FROM notes n
      LEFT JOIN topics t ON n.topic_id = t.id
      ORDER BY n.updated_at DESC LIMIT 5
    `).all();

    const bookmarkedNotes = db.prepare(`
      SELECT n.*, t.title as topic_title
      FROM notes n
      LEFT JOIN topics t ON n.topic_id = t.id
      WHERE n.is_bookmarked = 1
      ORDER BY n.updated_at DESC LIMIT 5
    `).all();

    const revisionQueue = Note.getRevisionQueue({ limit: 5 });

    const subjectProgress = subjects.map(s => {
      const topicCount = db.prepare('SELECT COUNT(*) as count FROM topics WHERE subject = ?').get(s.subject).count;
      const noteCount = db.prepare('SELECT COUNT(*) as count FROM notes WHERE subject = ?').get(s.subject).count;
      const bookCount = db.prepare('SELECT COUNT(*) as count FROM books WHERE subject = ?').get(s.subject).count;
      const caseCount = db.prepare('SELECT COUNT(*) as count FROM landmark_cases WHERE subject = ?').get(s.subject)?.count || 0;
      return {
        subject: s.subject,
        topics: topicCount,
        notes: noteCount,
        books: bookCount,
        cases: caseCount,
        completion: Math.min(100, Math.round(((topicCount + noteCount) / 20) * 100))
      };
    });

    const weakAreas = subjectProgress
      .filter(s => s.completion < 50)
      .sort((a, b) => a.completion - b.completion)
      .slice(0, 3);

    const aiRecommendations = [];
    if (weakAreas.length > 0) {
      aiRecommendations.push({
        type: 'focus',
        title: `Focus on ${weakAreas[0].subject}`,
        description: `Only ${weakAreas[0].completion}% coverage. Start with foundational topics.`,
        priority: 'high'
      });
    }
    if (bookmarkedNotes.length > 0) {
      aiRecommendations.push({
        type: 'revision',
        title: 'Review Bookmarked Notes',
        description: `You have ${bookmarkedNotes.length} bookmarked notes pending review.`,
        priority: 'medium'
      });
    }
    aiRecommendations.push({
      type: 'practice',
      title: 'Daily Practice',
      description: 'Complete 10 MCQs and review 5 flashcards today.',
      priority: 'low'
    });

    res.json({
      success: true,
      data: {
        stats: {
          books: bookStats,
          topics: topicStats,
          notes: noteStats,
          doctrines: doctrineStats,
          cases: caseStats,
          sections: sectionStats
        },
        subjects: subjectProgress,
        exam_types: examTypes,
        recent_notes: recentNotes,
        bookmarked_notes: bookmarkedNotes,
        revision_queue: revisionQueue,
        weak_areas: weakAreas,
        ai_recommendations: aiRecommendations,
        today_focus: {
          suggested_subject: weakAreas.length > 0 ? weakAreas[0].subject : subjectProgress[0]?.subject,
          suggested_action: 'Review foundational topics and complete practice questions'
        }
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard data', details: err.message });
  }
}

function getTopicHierarchy(req, res) {
  try {
    const db = getDb();
    const subjects = db.prepare('SELECT DISTINCT subject FROM books ORDER BY subject').all();

    const hierarchy = subjects.map(s => {
      const books = db.prepare('SELECT id, title, author FROM books WHERE subject = ? ORDER BY semester').all(s.subject);
      const chapters = Topic.getHierarchy(s.subject);
      return {
        subject: s.subject,
        books,
        chapters
      };
    });

    res.json({ success: true, data: hierarchy });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch topic hierarchy', details: err.message });
  }
}

function getSubjectHierarchy(req, res) {
  try {
    const { subject } = req.params;
    const hierarchy = Topic.getHierarchy(subject);
    res.json({ success: true, data: { subject, hierarchy } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subject hierarchy', details: err.message });
  }
}

function getTopicGraph(req, res) {
  try {
    const { topicId } = req.params;
    const topic = Topic.findById(topicId);
    if (!topic) return res.status(404).json({ error: 'Topic not found' });

    const related = Topic.getRelatedTopics(topicId);
    const children = Topic.getChildren(topicId);
    const parent = Topic.getParent(topicId);
    const notes = Note.findAll({ topic_id: topicId, limit: 10 });

    res.json({
      success: true,
      data: {
        topic,
        parent,
        children,
        related,
        notes
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch topic graph', details: err.message });
  }
}

function globalSearch(req, res) {
  try {
    const { q, type, limit = 20 } = req.query;
    if (!q || q.length < 2) return res.status(400).json({ error: 'Search query must be at least 2 characters' });

    const results = {
      sections: [],
      doctrines: [],
      cases: [],
      topics: [],
      notes: [],
      books: [],
      total: 0
    };

    if (!type || type === 'sections') {
      results.sections = Section.findAll({ search: q, limit: parseInt(limit) });
    }
    if (!type || type === 'doctrines') {
      results.doctrines = Doctrine.findAll({ search: q, limit: parseInt(limit) });
    }
    if (!type || type === 'cases') {
      results.cases = LandmarkCase.findAll({ search: q, limit: parseInt(limit) });
    }
    if (!type || type === 'topics') {
      results.topics = Topic.findAll({ search: q, limit: parseInt(limit) });
    }
    if (!type || type === 'notes') {
      results.notes = Note.findAll({ search: q, limit: parseInt(limit) });
    }
    if (!type || type === 'books') {
      results.books = Book.findAll({ search: q, limit: parseInt(limit) });
    }

    results.total = results.sections.length + results.doctrines.length + results.cases.length +
      results.topics.length + results.notes.length + results.books.length;

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
}

function getRevisionQueue(req, res) {
  try {
    const { subject, exam_tag, limit = 10 } = req.query;
    const queue = Note.getRevisionQueue({
      subject,
      exam_tag,
      limit: parseInt(limit)
    });
    res.json({ success: true, data: queue, count: queue.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch revision queue', details: err.message });
  }
}

function getStats(req, res) {
  try {
    res.json({
      success: true,
      data: {
        books: Book.getStats(),
        topics: Topic.getStats(),
        notes: Note.getStats(),
        doctrines: Doctrine.getStats(),
        cases: LandmarkCase.getStats(),
        sections: Section.getStats()
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats', details: err.message });
  }
}

function getDoctrines(req, res) {
  try {
    const filters = {
      subject: req.query.subject,
      exam_tag: req.query.exam_tag,
      semester: req.query.semester ? parseInt(req.query.semester) : null,
      search: req.query.search,
      limit: req.query.limit ? parseInt(req.query.limit) : 50
    };
    const doctrines = Doctrine.findAll(filters);
    res.json({ success: true, data: doctrines, count: doctrines.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctrines', details: err.message });
  }
}

function getDoctrineById(req, res) {
  try {
    const doctrine = Doctrine.findById(req.params.id);
    if (!doctrine) return res.status(404).json({ error: 'Doctrine not found' });
    res.json({ success: true, data: doctrine });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctrine', details: err.message });
  }
}

function getLandmarkCases(req, res) {
  try {
    const filters = {
      subject: req.query.subject,
      exam_tag: req.query.exam_tag,
      semester: req.query.semester ? parseInt(req.query.semester) : null,
      year: req.query.year ? parseInt(req.query.year) : null,
      court: req.query.court,
      search: req.query.search,
      limit: req.query.limit ? parseInt(req.query.limit) : 50
    };
    const cases = LandmarkCase.findAll(filters);
    res.json({ success: true, data: cases, count: cases.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch landmark cases', details: err.message });
  }
}

function getCaseById(req, res) {
  try {
    const caseData = LandmarkCase.findById(req.params.id);
    if (!caseData) return res.status(404).json({ error: 'Case not found' });
    res.json({ success: true, data: caseData });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch case', details: err.message });
  }
}

function getSections(req, res) {
  try {
    const filters = {
      subject: req.query.subject,
      act_name: req.query.act_name,
      section_number: req.query.section_number,
      exam_tag: req.query.exam_tag,
      semester: req.query.semester ? parseInt(req.query.semester) : null,
      search: req.query.search,
      limit: req.query.limit ? parseInt(req.query.limit) : 50
    };
    const sections = Section.findAll(filters);
    res.json({ success: true, data: sections, count: sections.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sections', details: err.message });
  }
}

function getSectionById(req, res) {
  try {
    const section = Section.findById(req.params.id);
    if (!section) return res.status(404).json({ error: 'Section not found' });
    res.json({ success: true, data: section });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch section', details: err.message });
  }
}

function getActsList(req, res) {
  try {
    const acts = Section.getActsList();
    res.json({ success: true, data: acts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch acts list', details: err.message });
  }
}

module.exports = {
  getDashboardData,
  getTopicHierarchy,
  getSubjectHierarchy,
  getTopicGraph,
  globalSearch,
  getRevisionQueue,
  getStats,
  getDoctrines,
  getDoctrineById,
  getLandmarkCases,
  getCaseById,
  getSections,
  getSectionById,
  getActsList
};
