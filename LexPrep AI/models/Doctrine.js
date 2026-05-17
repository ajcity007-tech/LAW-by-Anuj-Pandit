const { getDb } = require('./database');

function enrichDoctrine(row) {
  if (!row) return null;
  return {
    ...row,
    key_cases: row.key_cases ? JSON.parse(row.key_cases) : [],
    related_sections: row.related_sections ? JSON.parse(row.related_sections) : [],
    exam_tags_array: row.exam_tags ? row.exam_tags.split(',').map(t => t.trim()).filter(Boolean) : []
  };
}

class Doctrine {
  static findAll(filters = {}) {
    const db = getDb();
    let query = 'SELECT * FROM doctrines WHERE 1=1';
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
      query += ' AND (name LIKE ? OR description LIKE ? OR application LIKE ?)';
      const p = `%${filters.search}%`;
      params.push(p, p, p);
    }

    query += ' ORDER BY name ASC';
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    return db.prepare(query).all(...params).map(enrichDoctrine);
  }

  static findById(id) {
    const db = getDb();
    return enrichDoctrine(db.prepare('SELECT * FROM doctrines WHERE id = ?').get(id));
  }

  static findBySubject(subject) {
    return this.findAll({ subject });
  }

  static create(data) {
    const db = getDb();
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    const examTags = Array.isArray(data.exam_tags) ? data.exam_tags.join(',') : data.exam_tags;
    const keyCases = data.key_cases ? JSON.stringify(data.key_cases) : null;
    const relatedSections = data.related_sections ? JSON.stringify(data.related_sections) : null;

    db.prepare(`
      INSERT INTO doctrines (id, name, description, subject, origin_case, origin_case_citation,
        key_cases, application, exam_tags, semester, related_sections)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.name, data.description, data.subject, data.origin_case,
      data.origin_case_citation, keyCases, data.application, examTags, data.semester, relatedSections);
    db.save();
    return this.findById(id);
  }

  static getStats() {
    const db = getDb();
    return {
      total: db.prepare('SELECT COUNT(*) as count FROM doctrines').get().count,
      bySubject: db.prepare('SELECT subject, COUNT(*) as count FROM doctrines GROUP BY subject ORDER BY count DESC').all()
    };
  }
}

module.exports = Doctrine;
