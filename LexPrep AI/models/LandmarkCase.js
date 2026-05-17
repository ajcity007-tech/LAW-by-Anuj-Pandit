const { getDb } = require('./database');

function enrichCase(row) {
  if (!row) return null;
  return {
    ...row,
    related_sections: row.related_sections ? JSON.parse(row.related_sections) : [],
    related_doctrines: row.related_doctrines ? JSON.parse(row.related_doctrines) : [],
    exam_tags_array: row.exam_tags ? row.exam_tags.split(',').map(t => t.trim()).filter(Boolean) : []
  };
}

class LandmarkCase {
  static findAll(filters = {}) {
    const db = getDb();
    let query = 'SELECT * FROM landmark_cases WHERE 1=1';
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
    if (filters.year) {
      query += ' AND year = ?';
      params.push(filters.year);
    }
    if (filters.court) {
      query += ' AND court = ?';
      params.push(filters.court);
    }
    if (filters.search) {
      query += ' AND (case_name LIKE ? OR citation LIKE ? OR ratio LIKE ? OR significance LIKE ?)';
      const p = `%${filters.search}%`;
      params.push(p, p, p, p);
    }

    query += ' ORDER BY year DESC, case_name ASC';
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    return db.prepare(query).all(...params).map(enrichCase);
  }

  static findById(id) {
    const db = getDb();
    return enrichCase(db.prepare('SELECT * FROM landmark_cases WHERE id = ?').get(id));
  }

  static findByCitation(citation) {
    const db = getDb();
    return enrichCase(db.prepare('SELECT * FROM landmark_cases WHERE citation LIKE ?').get(`%${citation}%`));
  }

  static findBySubject(subject) {
    return this.findAll({ subject });
  }

  static create(data) {
    const db = getDb();
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    const examTags = Array.isArray(data.exam_tags) ? data.exam_tags.join(',') : data.exam_tags;
    const relatedSections = data.related_sections ? JSON.stringify(data.related_sections) : null;
    const relatedDoctrines = data.related_doctrines ? JSON.stringify(data.related_doctrines) : null;

    db.prepare(`
      INSERT INTO landmark_cases (id, case_name, citation, court, year, subject, bench_strength,
        facts, issues, holding, ratio, significance, exam_tags, semester,
        related_sections, related_doctrines)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.case_name, data.citation, data.court, data.year, data.subject,
      data.bench_strength, data.facts, data.issues, data.holding, data.ratio,
      data.significance, examTags, data.semester, relatedSections, relatedDoctrines);
    db.save();
    return this.findById(id);
  }

  static getStats() {
    const db = getDb();
    return {
      total: db.prepare('SELECT COUNT(*) as count FROM landmark_cases').get().count,
      bySubject: db.prepare('SELECT subject, COUNT(*) as count FROM landmark_cases GROUP BY subject ORDER BY count DESC').all(),
      byCourt: db.prepare('SELECT court, COUNT(*) as count FROM landmark_cases WHERE court IS NOT NULL GROUP BY court ORDER BY count DESC').all(),
      byDecade: db.prepare("SELECT (year/10)*10 as decade, COUNT(*) as count FROM landmark_cases WHERE year IS NOT NULL GROUP BY decade ORDER BY decade DESC").all()
    };
  }
}

module.exports = LandmarkCase;
