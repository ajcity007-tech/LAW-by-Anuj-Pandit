const { getDb } = require('./database');

class Question {
  static findAll(filters = {}) {
    const db = getDb();
    let query = 'SELECT * FROM questions WHERE 1=1';
    const params = [];

    if (filters.subject) {
      query += ' AND subject = ?';
      params.push(filters.subject);
    }
    if (filters.type) {
      query += ' AND type = ?';
      params.push(filters.type);
    }
    if (filters.exam_tag) {
      query += ' AND exam_tags LIKE ?';
      params.push(`%${filters.exam_tag}%`);
    }
    if (filters.semester) {
      query += ' AND semester = ?';
      params.push(filters.semester);
    }
    if (filters.difficulty) {
      query += ' AND difficulty = ?';
      params.push(filters.difficulty);
    }
    if (filters.topic_id) {
      query += ' AND topic_id = ?';
      params.push(filters.topic_id);
    }
    if (filters.search) {
      query += ' AND (question LIKE ? OR explanation LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY difficulty, created_at DESC';
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    return db.prepare(query).all(...params);
  }

  static findById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
  }

  static searchFTS(query) {
    const db = getDb();
    return db.prepare(`
      SELECT questions.*, highlight(questions_fts, 0, '<mark>', '</mark>') as question_hl
      FROM questions_fts
      JOIN questions ON questions.rowid = questions_fts.rowid
      WHERE questions_fts MATCH ?
      LIMIT 20
    `).all(query);
  }

  static getRandomBySubject(subject, count = 10) {
    const db = getDb();
    return db.prepare('SELECT * FROM questions WHERE subject = ? ORDER BY RANDOM() LIMIT ?').all(subject, count);
  }

  static create(data) {
    const db = getDb();
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    const options = Array.isArray(data.options) ? JSON.stringify(data.options) : data.options;
    const examTags = Array.isArray(data.exam_tags) ? data.exam_tags.join(',') : data.exam_tags;
    db.prepare(`
      INSERT INTO questions (id, topic_id, type, question, options, correct_answer, explanation, subject, exam_tags, semester, difficulty, marks, source_reference)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.topic_id, data.type, data.question, options, data.correct_answer, data.explanation, data.subject, examTags, data.semester, data.difficulty, data.marks || 1, data.source_reference);
    db.save();
    return this.findById(id);
  }

  static delete(id) {
    const db = getDb();
    db.prepare('DELETE FROM questions WHERE id = ?').run(id);
    db.save();
    return { success: true };
  }

  static getStats() {
    const db = getDb();
    return {
      total: db.prepare('SELECT COUNT(*) as count FROM questions').get().count,
      byType: db.prepare('SELECT type, COUNT(*) as count FROM questions GROUP BY type').all(),
      bySubject: db.prepare('SELECT subject, COUNT(*) as count FROM questions GROUP BY subject ORDER BY count DESC').all(),
      byDifficulty: db.prepare('SELECT difficulty, COUNT(*) as count FROM questions GROUP BY difficulty').all()
    };
  }
}

module.exports = Question;
