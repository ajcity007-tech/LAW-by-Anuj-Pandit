const { getDb } = require('./database');

class Test {
  static findAll(filters = {}) {
    const db = getDb();
    let query = 'SELECT * FROM tests WHERE 1=1';
    const params = [];

    if (filters.exam_type) {
      query += ' AND exam_type = ?';
      params.push(filters.exam_type);
    }
    if (filters.subject) {
      query += ' AND subject = ?';
      params.push(filters.subject);
    }
    if (filters.is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.is_active ? 1 : 0);
    }

    query += ' ORDER BY created_at DESC';
    return db.prepare(query).all(...params);
  }

  static findById(id) {
    const db = getDb();
    const test = db.prepare('SELECT * FROM tests WHERE id = ?').get(id);
    if (test && test.question_ids) {
      test.questions = db.prepare('SELECT * FROM questions WHERE id IN (' + test.question_ids.split(',').map(() => '?').join(',') + ')').all(...test.question_ids.split(','));
    }
    return test;
  }

  static create(data) {
    const db = getDb();
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    const questionIds = Array.isArray(data.question_ids) ? data.question_ids.join(',') : data.question_ids;
    db.prepare(`
      INSERT INTO tests (id, title, description, exam_type, subject, duration_minutes, total_marks, passing_marks, question_ids)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.title, data.description, data.exam_type, data.subject, data.duration_minutes || 60, data.total_marks, data.passing_marks, questionIds);
    db.save();
    return this.findById(id);
  }

  static generateMockTest(config) {
    const db = getDb();
    const { v4: uuidv4 } = require('uuid');
    const { subject, exam_type, mcq_count = 20, short_count = 5, long_count = 2, duration_minutes = 60 } = config;

    let whereClause = 'WHERE 1=1';
    const params = [];
    if (subject) { whereClause += ' AND subject = ?'; params.push(subject); }

    const mcqs = db.prepare(`SELECT id FROM questions ${whereClause} AND type = 'mcq' ORDER BY RANDOM() LIMIT ?`).all(...params, mcq_count).map(q => q.id);
    const shorts = db.prepare(`SELECT id FROM questions ${whereClause} AND type = 'short' ORDER BY RANDOM() LIMIT ?`).all(...params, short_count).map(q => q.id);
    const longs = db.prepare(`SELECT id FROM questions ${whereClause} AND type = 'long' ORDER BY RANDOM() LIMIT ?`).all(...params, long_count).map(q => q.id);

    const allIds = [...mcqs, ...shorts, ...longs];
    const totalMarks = mcqs.length * 1 + shorts.length * 5 + longs.length * 10;

    return this.create({
      title: `${subject} Mock Test - ${exam_type}`,
      description: `Auto-generated mock test for ${subject}`,
      exam_type,
      subject,
      duration_minutes,
      total_marks: totalMarks,
      passing_marks: Math.floor(totalMarks * 0.4),
      question_ids: allIds
    });
  }

  static saveResult(data) {
    const db = getDb();
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    const answers = Array.isArray(data.answers) ? JSON.stringify(data.answers) : data.answers;
    db.prepare(`
      INSERT INTO test_results (id, user_id, test_id, score, total_marks, percentage, answers, time_taken_minutes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.user_id, data.test_id, data.score, data.total_marks, data.percentage, answers, data.time_taken_minutes);
    db.save();
    return db.prepare('SELECT * FROM test_results WHERE id = ?').get(id);
  }

  static getUserResults(userId) {
    const db = getDb();
    return db.prepare(`
      SELECT test_results.*, tests.title as test_title, tests.exam_type
      FROM test_results
      JOIN tests ON test_results.test_id = tests.id
      WHERE test_results.user_id = ?
      ORDER BY test_results.completed_at DESC
    `).all(userId);
  }

  static delete(id) {
    const db = getDb();
    db.prepare('DELETE FROM tests WHERE id = ?').run(id);
    db.save();
    return { success: true };
  }

  static getStats() {
    const db = getDb();
    return {
      total: db.prepare('SELECT COUNT(*) as count FROM tests').get().count,
      results: db.prepare('SELECT COUNT(*) as count FROM test_results').get().count,
      avgPercentage: db.prepare('SELECT AVG(percentage) as avg_pct FROM test_results').get().avg_pct
    };
  }
}

module.exports = Test;
