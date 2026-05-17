const { getDb } = require('./database');

function enrichTopic(row) {
  if (!row) return null;
  return {
    ...row,
    related_topics: row.related_topics ? JSON.parse(row.related_topics) : [],
    prerequisites: row.prerequisites ? JSON.parse(row.prerequisites) : [],
    key_sections: row.key_sections ? JSON.parse(row.key_sections) : [],
    key_cases: row.key_cases ? JSON.parse(row.key_cases) : [],
    exam_tags_array: row.exam_tags ? row.exam_tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    topic_path_array: row.topic_path ? row.topic_path.split(' > ').filter(Boolean) : []
  };
}

class Topic {
  static findAll(filters = {}) {
    const db = getDb();
    let query = 'SELECT topics.*, books.title as book_title FROM topics LEFT JOIN books ON topics.book_id = books.id WHERE 1=1';
    const params = [];

    if (filters.subject) {
      query += ' AND topics.subject = ?';
      params.push(filters.subject);
    }
    if (filters.book_id) {
      query += ' AND topics.book_id = ?';
      params.push(filters.book_id);
    }
    if (filters.exam_tag) {
      query += ' AND topics.exam_tags LIKE ?';
      params.push(`%${filters.exam_tag}%`);
    }
    if (filters.semester) {
      query += ' AND topics.semester = ?';
      params.push(filters.semester);
    }
    if (filters.difficulty) {
      query += ' AND topics.difficulty = ?';
      params.push(filters.difficulty);
    }
    if (filters.parent_topic_id) {
      query += ' AND topics.parent_topic_id = ?';
      params.push(filters.parent_topic_id);
    }
    if (filters.is_chapter) {
      query += filters.is_chapter === 'true' ? ' AND topics.parent_topic_id IS NULL' : ' AND topics.parent_topic_id IS NOT NULL';
    }
    if (filters.search) {
      query += ' AND (topics.title LIKE ? OR topics.content LIKE ? OR topics.summary LIKE ?)';
      const searchParam = `%${filters.search}%`;
      params.push(searchParam, searchParam, searchParam);
    }
    if (filters.topic_path) {
      query += ' AND topics.topic_path LIKE ?';
      params.push(`%${filters.topic_path}%`);
    }

    const orderBy = filters.order_by || 'topics.order_index';
    const orderDir = filters.order_dir || 'ASC';
    query += ` ORDER BY ${orderBy} ${orderDir}`;

    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    return db.prepare(query).all(...params).map(enrichTopic);
  }

  static findById(id) {
    const db = getDb();
    const row = db.prepare(`
      SELECT topics.*, books.title as book_title, books.author as book_author
      FROM topics
      LEFT JOIN books ON topics.book_id = books.id
      WHERE topics.id = ?
    `).get(id);
    return enrichTopic(row);
  }

  static getNotes(topicId) {
    const db = getDb();
    return db.prepare('SELECT * FROM notes WHERE topic_id = ? ORDER BY created_at DESC').all(topicId);
  }

  static getQuestions(topicId) {
    const db = getDb();
    return db.prepare('SELECT * FROM questions WHERE topic_id = ? ORDER BY difficulty, created_at').all(topicId);
  }

  static getChildren(topicId) {
    const db = getDb();
    return db.prepare('SELECT * FROM topics WHERE parent_topic_id = ? ORDER BY order_index ASC').all(topicId).map(enrichTopic);
  }

  static getParent(topicId) {
    const db = getDb();
    const topic = this.findById(topicId);
    if (!topic || !topic.parent_topic_id) return null;
    return this.findById(topic.parent_topic_id);
  }

  static getHierarchy(subject) {
    const db = getDb();
    const chapters = db.prepare(`
      SELECT t.*, b.title as book_title
      FROM topics t
      LEFT JOIN books b ON t.book_id = b.id
      WHERE t.subject = ? AND t.parent_topic_id IS NULL
      ORDER BY t.order_index ASC
    `).all(subject).map(enrichTopic);

    const hierarchy = chapters.map(chapter => {
      const subtopics = db.prepare(`
        SELECT * FROM topics WHERE parent_topic_id = ? ORDER BY order_index ASC
      `).all(chapter.id).map(enrichTopic);
      return { ...chapter, children: subtopics };
    });

    return hierarchy;
  }

  static getRelatedTopics(topicId) {
    const db = getDb();
    return db.prepare(`
      SELECT t.*, tg.relation_type, tg.strength
      FROM topic_graph tg
      JOIN topics t ON t.id = tg.to_topic_id
      WHERE tg.from_topic_id = ?
      ORDER BY tg.strength DESC
      LIMIT 10
    `).all(topicId).map(enrichTopic);
  }

  static searchFTS(query) {
    const db = getDb();
    return db.prepare(`
      SELECT topics.*, highlight(topics_fts, 0, '<mark>', '</mark>') as title_hl
      FROM topics_fts
      JOIN topics ON topics.rowid = topics_fts.rowid
      WHERE topics_fts MATCH ?
      LIMIT 20
    `).all(query).map(enrichTopic);
  }

  static create(data) {
    const db = getDb();
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    const examTags = Array.isArray(data.exam_tags) ? data.exam_tags.join(',') : data.exam_tags;
    const relatedTopics = data.related_topics ? JSON.stringify(data.related_topics) : null;
    const prerequisites = data.prerequisites ? JSON.stringify(data.prerequisites) : null;
    const keySections = data.key_sections ? JSON.stringify(data.key_sections) : null;
    const keyCases = data.key_cases ? JSON.stringify(data.key_cases) : null;

    db.prepare(`
      INSERT INTO topics (id, book_id, parent_topic_id, title, subject, content, summary,
        exam_tags, semester, difficulty, order_index, topic_path,
        related_topics, prerequisites, key_sections, key_cases)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.book_id, data.parent_topic_id || null, data.title, data.subject,
      data.content, data.summary, examTags, data.semester, data.difficulty, data.order_index || 0,
      data.topic_path, relatedTopics, prerequisites, keySections, keyCases);
    db.save();
    return this.findById(id);
  }

  static update(id, data) {
    const db = getDb();
    const fields = [];
    const params = [];

    const textFields = ['title', 'content', 'summary', 'topic_path'];
    for (const field of textFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`);
        params.push(data[field]);
      }
    }
    if (data.exam_tags) { fields.push('exam_tags = ?'); params.push(Array.isArray(data.exam_tags) ? data.exam_tags.join(',') : data.exam_tags); }
    if (data.difficulty) { fields.push('difficulty = ?'); params.push(data.difficulty); }
    if (data.order_index !== undefined) { fields.push('order_index = ?'); params.push(data.order_index); }
    if (data.parent_topic_id !== undefined) { fields.push('parent_topic_id = ?'); params.push(data.parent_topic_id); }
    if (data.related_topics) { fields.push('related_topics = ?'); params.push(JSON.stringify(data.related_topics)); }
    if (data.prerequisites) { fields.push('prerequisites = ?'); params.push(JSON.stringify(data.prerequisites)); }
    if (data.key_sections) { fields.push('key_sections = ?'); params.push(JSON.stringify(data.key_sections)); }
    if (data.key_cases) { fields.push('key_cases = ?'); params.push(JSON.stringify(data.key_cases)); }

    if (fields.length === 0) return this.findById(id);

    params.push(id);
    db.prepare(`UPDATE topics SET ${fields.join(', ')} WHERE id = ?`).run(...params);
    db.save();
    return this.findById(id);
  }

  static delete(id) {
    const db = getDb();
    db.prepare('DELETE FROM topics WHERE id = ?').run(id);
    db.save();
    return { success: true };
  }

  static getStats() {
    const db = getDb();
    return {
      total: db.prepare('SELECT COUNT(*) as count FROM topics').get().count,
      chapters: db.prepare('SELECT COUNT(*) as count FROM topics WHERE parent_topic_id IS NULL').get().count,
      subtopics: db.prepare('SELECT COUNT(*) as count FROM topics WHERE parent_topic_id IS NOT NULL').get().count,
      bySubject: db.prepare('SELECT subject, COUNT(*) as count FROM topics GROUP BY subject ORDER BY count DESC').all(),
      byDifficulty: db.prepare('SELECT difficulty, COUNT(*) as count FROM topics GROUP BY difficulty').all()
    };
  }
}

module.exports = Topic;
