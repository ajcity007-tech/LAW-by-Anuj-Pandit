const { getDb } = require('./database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

class User {
  static create({ email, password, name, role = 'student', exam_focus, semester }) {
    const db = getDb();
    const id = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (id, email, password, name, role, exam_focus, semester)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(id, email, hashedPassword, name, role, exam_focus || null, semester || null);
    db.save();
    return this.findById(id);
  }

  static findById(id) {
    const db = getDb();
    return db.prepare('SELECT id, email, name, role, avatar, exam_focus, semester, created_at FROM users WHERE id = ?').get(id);
  }

  static findByEmail(email) {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  static verifyPassword(user, password) {
    return bcrypt.compareSync(password, user.password);
  }

  static updateProgress(userId, subject, topicsCompleted) {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM study_progress WHERE user_id = ? AND subject = ?').get(userId, subject);
    if (existing) {
      db.prepare('UPDATE study_progress SET topics_completed = ?, last_studied = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND subject = ?').run(topicsCompleted, userId, subject);
    } else {
      db.prepare('INSERT INTO study_progress (id, user_id, subject, topics_completed, topics_total) VALUES (?, ?, ?, ?, 100)').run(uuidv4(), userId, subject, topicsCompleted);
    }
    db.save();
  }

  static getProgress(userId) {
    const db = getDb();
    return db.prepare('SELECT * FROM study_progress WHERE user_id = ? ORDER BY subject').all(userId);
  }

  static addBookmark(userId, itemType, itemId) {
    const db = getDb();
    try {
      const existing = db.prepare('SELECT id FROM bookmarks WHERE user_id = ? AND item_type = ? AND item_id = ?').get(userId, itemType, itemId);
      if (existing) return { success: false, error: 'Bookmark already exists' };
      db.prepare('INSERT INTO bookmarks (id, user_id, item_type, item_id) VALUES (?, ?, ?, ?)').run(uuidv4(), userId, itemType, itemId);
      db.save();
      return { success: true };
    } catch (e) {
      return { success: false, error: 'Bookmark already exists' };
    }
  }

  static removeBookmark(userId, itemType, itemId) {
    const db = getDb();
    db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND item_type = ? AND item_id = ?').run(userId, itemType, itemId);
    return { success: true };
  }

  static getBookmarks(userId) {
    const db = getDb();
    return db.prepare('SELECT * FROM bookmarks WHERE user_id = ? ORDER BY created_at DESC').all(userId);
  }

  static logSearch(userId, query, resultsCount) {
    const db = getDb();
    db.prepare('INSERT INTO search_logs (id, user_id, query, results_count) VALUES (?, ?, ?, ?)').run(uuidv4(), userId, query, resultsCount);
    db.save();
  }
}

module.exports = User;
