const { getDb } = require('./database');

function parseJsonField(value) {
  if (!value) return null;
  try { return JSON.parse(value); } catch { return value; }
}

function serializeArray(arr) {
  if (!arr) return null;
  return Array.isArray(arr) ? JSON.stringify(arr) : arr;
}

function enrichNote(row) {
  if (!row) return null;
  return {
    ...row,
    leading_cases: parseJsonField(row.leading_cases),
    mcqs: parseJsonField(row.mcqs),
    related_topics: parseJsonField(row.related_topics),
    citations: parseJsonField(row.citations),
    quick_revision_bullets: parseJsonField(row.quick_revision_bullets),
    exam_tags_array: row.exam_tags ? row.exam_tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    tags_array: row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    topic_path_array: row.topic_path ? row.topic_path.split(' > ').filter(Boolean) : []
  };
}

class Note {
  static findAll(filters = {}) {
    const db = getDb();
    let query = 'SELECT notes.*, topics.title as topic_title, topics.subject as topic_subject FROM notes LEFT JOIN topics ON notes.topic_id = topics.id WHERE 1=1';
    const params = [];

    if (filters.subject) {
      query += ' AND notes.subject = ?';
      params.push(filters.subject);
    }
    if (filters.exam_tag) {
      query += ' AND notes.exam_tags LIKE ?';
      params.push(`%${filters.exam_tag}%`);
    }
    if (filters.semester) {
      query += ' AND notes.semester = ?';
      params.push(filters.semester);
    }
    if (filters.topic_id) {
      query += ' AND notes.topic_id = ?';
      params.push(filters.topic_id);
    }
    if (filters.difficulty) {
      query += ' AND notes.confidence_score <= ?';
      params.push(1 - (filters.difficulty === 'hard' ? 0.7 : filters.difficulty === 'medium' ? 0.5 : 0.3));
    }
    if (filters.search) {
      query += ' AND (notes.title LIKE ? OR notes.content LIKE ? OR notes.overview LIKE ? OR notes.definition_rule LIKE ?)';
      const searchParam = `%${filters.search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }
    if (filters.bookmarked_only) {
      query += ' AND notes.is_bookmarked = 1';
    }
    if (filters.topic_path) {
      query += ' AND notes.topic_path LIKE ?';
      params.push(`%${filters.topic_path}%`);
    }

    const orderBy = filters.order_by || 'notes.created_at';
    const orderDir = filters.order_dir || 'DESC';
    query += ` ORDER BY ${orderBy} ${orderDir}`;

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    return db.prepare(query).all(...params).map(enrichNote);
  }

  static findById(id) {
    const db = getDb();
    const row = db.prepare(`
      SELECT notes.*, topics.title as topic_title, topics.subject as topic_subject, topics.book_id
      FROM notes
      LEFT JOIN topics ON notes.topic_id = topics.id
      WHERE notes.id = ?
    `).get(id);
    return enrichNote(row);
  }

  static searchFTS(query) {
    const db = getDb();
    return db.prepare(`
      SELECT notes.*, highlight(notes_fts, 0, '<mark>', '</mark>') as title_hl
      FROM notes_fts
      JOIN notes ON notes.rowid = notes_fts.rowid
      WHERE notes_fts MATCH ?
      LIMIT 20
    `).all(query).map(enrichNote);
  }

  static create(data) {
    const db = getDb();
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    const examTags = Array.isArray(data.exam_tags) ? data.exam_tags.join(',') : data.exam_tags;
    const tags = Array.isArray(data.tags) ? data.tags.join(',') : data.tags;
    const leadingCases = serializeArray(data.leading_cases);
    const mcqs = serializeArray(data.mcqs);
    const relatedTopics = serializeArray(data.related_topics);
    const citations = serializeArray(data.citations);
    const quickBullets = serializeArray(data.quick_revision_bullets);

    db.prepare(`
      INSERT INTO notes (id, topic_id, title, content, subject, exam_tags, semester, tags,
        overview, why_it_matters, definition_rule, statutory_basis, key_provisions,
        leading_cases, irac_analysis, exam_explanation, quick_revision_bullets,
        deep_revision_summary, mcqs, long_answer_outline, related_topics, citations,
        confidence_score, topic_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.topic_id, data.title, data.content, data.subject, examTags, data.semester, tags,
      data.overview, data.why_it_matters, data.definition_rule, data.statutory_basis, data.key_provisions,
      leadingCases, data.irac_analysis, data.exam_explanation, quickBullets,
      data.deep_revision_summary, mcqs, data.long_answer_outline, relatedTopics, citations,
      data.confidence_score || 0.5, data.topic_path);
    db.save();
    return this.findById(id);
  }

  static update(id, data) {
    const db = getDb();
    const fields = [];
    const params = [];

    const textFields = ['title', 'content', 'overview', 'why_it_matters', 'definition_rule',
      'statutory_basis', 'key_provisions', 'irac_analysis', 'exam_explanation',
      'deep_revision_summary', 'long_answer_outline', 'topic_path'];
    const jsonFields = ['leading_cases', 'mcqs', 'related_topics', 'citations', 'quick_revision_bullets'];

    for (const field of textFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        params.push(data[field]);
      }
    }
    for (const field of jsonFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        params.push(serializeArray(data[field]));
      }
    }
    if (data.tags) { fields.push('tags = ?'); params.push(Array.isArray(data.tags) ? data.tags.join(',') : data.tags); }
    if (data.exam_tags) { fields.push('exam_tags = ?'); params.push(Array.isArray(data.exam_tags) ? data.exam_tags.join(',') : data.exam_tags); }
    if (data.confidence_score !== undefined) { fields.push('confidence_score = ?'); params.push(data.confidence_score); }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    db.prepare(`UPDATE notes SET ${fields.join(', ')} WHERE id = ?`).run(...params);
    db.save();
    return this.findById(id);
  }

  static toggleBookmark(id) {
    const db = getDb();
    const note = this.findById(id);
    db.prepare('UPDATE notes SET is_bookmarked = ? WHERE id = ?').run(note.is_bookmarked ? 0 : 1, id);
    db.save();
    return this.findById(id);
  }

  static delete(id) {
    const db = getDb();
    db.prepare('DELETE FROM notes WHERE id = ?').run(id);
    db.save();
    return { success: true };
  }

  static getStats() {
    const db = getDb();
    return {
      total: db.prepare('SELECT COUNT(*) as count FROM notes').get().count,
      bookmarked: db.prepare('SELECT COUNT(*) as count FROM notes WHERE is_bookmarked = 1').get().count,
      bySubject: db.prepare('SELECT subject, COUNT(*) as count FROM notes GROUP BY subject ORDER BY count DESC').all(),
      byExamTag: db.prepare('SELECT exam_tags, COUNT(*) as count FROM notes WHERE exam_tags IS NOT NULL GROUP BY exam_tags ORDER BY count DESC LIMIT 10').all(),
      avgConfidence: db.prepare('SELECT AVG(confidence_score) as avg_score FROM notes').get().avg_score || 0,
      withStructuredData: db.prepare("SELECT COUNT(*) as count FROM notes WHERE overview IS NOT NULL OR leading_cases IS NOT NULL").get().count
    };
  }

  static getRevisionQueue(filters = {}) {
    const db = getDb();
    let query = `
      SELECT notes.*, topics.title as topic_title
      FROM notes
      LEFT JOIN topics ON notes.topic_id = topics.id
      WHERE notes.is_bookmarked = 1 OR notes.confidence_score < 0.7
    `;
    const params = [];

    if (filters.subject) {
      query += ' AND notes.subject = ?';
      params.push(filters.subject);
    }
    if (filters.exam_tag) {
      query += ' AND notes.exam_tags LIKE ?';
      params.push(`%${filters.exam_tag}%`);
    }

    query += ' ORDER BY notes.confidence_score ASC, notes.updated_at ASC';
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    return db.prepare(query).all(...params).map(enrichNote);
  }

  static getByTopicPath(topicPath) {
    const db = getDb();
    return db.prepare(`
      SELECT notes.*, topics.title as topic_title
      FROM notes
      LEFT JOIN topics ON notes.topic_id = topics.id
      WHERE notes.topic_path LIKE ?
      ORDER BY notes.created_at DESC
    `).all(`%${topicPath}%`).map(enrichNote);
  }
}

module.exports = Note;
