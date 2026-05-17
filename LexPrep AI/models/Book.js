const { getDb } = require('./database');

function enrichBook(row) {
  if (!row) return null;
  return {
    ...row,
    exam_tags_array: row.exam_tags ? row.exam_tags.split(',').map(t => t.trim()).filter(Boolean) : []
  };
}

class Book {
  static findAll(filters = {}) {
    const db = getDb();
    let query = 'SELECT * FROM books WHERE 1=1';
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
    if (filters.search) {
      query += ' AND (title LIKE ? OR author LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY created_at DESC';
    return db.prepare(query).all(...params).map(enrichBook);
  }

  static findById(id) {
    const db = getDb();
    return enrichBook(db.prepare('SELECT * FROM books WHERE id = ?').get(id));
  }

  static getChapters(bookId) {
    const db = getDb();
    return db.prepare('SELECT * FROM topics WHERE book_id = ? AND parent_topic_id IS NULL ORDER BY order_index').all(bookId);
  }

  static getFullHierarchy(bookId) {
    const chapters = this.getChapters(bookId);
    const db = getDb();
    return chapters.map(chapter => {
      const subtopics = db.prepare(
        'SELECT * FROM topics WHERE parent_topic_id = ? ORDER BY order_index'
      ).all(chapter.id);
      return { ...chapter, children: subtopics };
    });
  }

  static searchFTS(query) {
    const db = getDb();
    return db.prepare(`
      SELECT books.*, highlight(books_fts, 0, '<mark>', '</mark>') as title_hl
      FROM books_fts
      JOIN books ON books.rowid = books_fts.rowid
      WHERE books_fts MATCH ?
      LIMIT 20
    `).all(query).map(enrichBook);
  }

  static create(data) {
    const db = getDb();
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    const examTags = Array.isArray(data.exam_tags) ? data.exam_tags.join(',') : data.exam_tags;
    db.prepare(`
      INSERT INTO books (id, title, author, subject, description, exam_tags, semester, year, total_chapters, is_open_access, cover_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.title, data.author, data.subject, data.description, examTags, data.semester, data.year, data.total_chapters, data.is_open_access ? 1 : 0, data.cover_url);
    db.save();
    return this.findById(id);
  }

  static delete(id) {
    const db = getDb();
    db.prepare('DELETE FROM books WHERE id = ?').run(id);
    db.save();
    return { success: true };
  }

  static getStats() {
    const db = getDb();
    return {
      total: db.prepare('SELECT COUNT(*) as count FROM books').get().count,
      bySubject: db.prepare('SELECT subject, COUNT(*) as count FROM books GROUP BY subject ORDER BY count DESC').all(),
      openAccess: db.prepare('SELECT COUNT(*) as count FROM books WHERE is_open_access = 1').get().count
    };
  }
}

module.exports = Book;
