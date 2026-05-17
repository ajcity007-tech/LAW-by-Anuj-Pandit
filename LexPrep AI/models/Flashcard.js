const { getDb } = require('./database');

class Flashcard {
  static findAll(filters = {}) {
    const db = getDb();
    let query = 'SELECT * FROM flashcards WHERE 1=1';
    const params = [];

    if (filters.subject) {
      query += ' AND subject = ?';
      params.push(filters.subject);
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
    if (filters.search) {
      query += ' AND (front LIKE ? OR back LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY next_review ASC, created_at DESC';
    return db.prepare(query).all(...params);
  }

  static findById(id) {
    const db = getDb();
    return db.prepare('SELECT * FROM flashcards WHERE id = ?').get(id);
  }

  static getDueForReview(userId) {
    const db = getDb();
    return db.prepare(`
      SELECT f.* FROM flashcards f
      LEFT JOIN user_flashcard_progress ufp ON f.id = ufp.flashcard_id AND ufp.user_id = ?
      WHERE ufp.next_review IS NULL OR ufp.next_review <= CURRENT_TIMESTAMP
      ORDER BY f.next_review ASC
      LIMIT 20
    `).all(userId);
  }

  static create(data) {
    const db = getDb();
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    const examTags = Array.isArray(data.exam_tags) ? data.exam_tags.join(',') : data.exam_tags;
    db.prepare(`
      INSERT INTO flashcards (id, front, back, subject, exam_tags, semester, difficulty)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.front, data.back, data.subject, examTags, data.semester, data.difficulty || 'medium');
    db.save();
    return this.findById(id);
  }

  static updateProgress(userId, flashcardId, quality) {
    const db = getDb();
    const progress = db.prepare('SELECT * FROM user_flashcard_progress WHERE user_id = ? AND flashcard_id = ?').get(userId, flashcardId);

    let interval, easeFactor, repetitions, status;

    if (!progress) {
      repetitions = 1;
      interval = 1;
      easeFactor = 2.5;
      status = 'learning';
    } else {
      repetitions = progress.repetitions + 1;
      easeFactor = Math.max(1.3, progress.ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
      if (quality >= 3) {
        interval = repetitions === 1 ? 1 : repetitions === 2 ? 6 : Math.round(progress.interval_days * easeFactor);
        status = repetitions > 5 ? 'mastered' : 'review';
      } else {
        interval = 1;
        repetitions = 0;
        status = 'learning';
      }
    }

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    if (progress) {
      db.prepare(`
        UPDATE user_flashcard_progress
        SET status = ?, last_reviewed = CURRENT_TIMESTAMP, next_review = ?, repetitions = ?, interval_days = ?, ease_factor = ?
        WHERE user_id = ? AND flashcard_id = ?
      `).run(status, nextReview.toISOString().split('T')[0], repetitions, interval, easeFactor, userId, flashcardId);
    } else {
      const { v4: uuidv4 } = require('uuid');
      db.prepare(`
        INSERT INTO user_flashcard_progress (id, user_id, flashcard_id, status, last_reviewed, next_review, repetitions, interval_days, ease_factor)
        VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?, ?, ?)
      `).run(uuidv4(), userId, flashcardId, status, nextReview.toISOString().split('T')[0], repetitions, interval, easeFactor);
    }
    db.save();

    return { interval, easeFactor, repetitions, status, next_review: nextReview.toISOString().split('T')[0] };
  }

  static delete(id) {
    const db = getDb();
    db.prepare('DELETE FROM flashcards WHERE id = ?').run(id);
    db.prepare('DELETE FROM user_flashcard_progress WHERE flashcard_id = ?').run(id);
    db.save();
    return { success: true };
  }

  static getStats() {
    const db = getDb();
    return {
      total: db.prepare('SELECT COUNT(*) as count FROM flashcards').get().count,
      bySubject: db.prepare('SELECT subject, COUNT(*) as count FROM flashcards GROUP BY subject ORDER BY count DESC').all()
    };
  }
}

module.exports = Flashcard;
