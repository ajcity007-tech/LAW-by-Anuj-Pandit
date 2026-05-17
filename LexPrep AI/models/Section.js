const { getDb } = require('./database');

function enrichSection(row) {
  if (!row) return null;
  return {
    ...row,
    related_cases: row.related_cases ? JSON.parse(row.related_cases) : [],
    related_sections: row.related_sections ? JSON.parse(row.related_sections) : [],
    exam_tags_array: row.exam_tags ? row.exam_tags.split(',').map(t => t.trim()).filter(Boolean) : []
  };
}

class Section {
  static findAll(filters = {}) {
    const db = getDb();
    let query = 'SELECT * FROM sections WHERE 1=1';
    const params = [];

    if (filters.subject) {
      query += ' AND subject = ?';
      params.push(filters.subject);
    }
    if (filters.act_name) {
      query += ' AND act_name = ?';
      params.push(filters.act_name);
    }
    if (filters.section_number) {
      query += ' AND section_number = ?';
      params.push(filters.section_number);
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
      query += ' AND (section_number LIKE ? OR act_name LIKE ? OR title LIKE ? OR text LIKE ? OR explanation LIKE ?)';
      const p = `%${filters.search}%`;
      params.push(p, p, p, p, p);
    }

    query += ' ORDER BY act_name ASC, CAST(section_number AS INTEGER) ASC';
    if (filters.limit) {
      query += ' LIMIT ?';
      params.push(filters.limit);
    }

    return db.prepare(query).all(...params).map(enrichSection);
  }

  static findById(id) {
    const db = getDb();
    return enrichSection(db.prepare('SELECT * FROM sections WHERE id = ?').get(id));
  }

  static findByActAndNumber(actName, sectionNumber) {
    const db = getDb();
    return enrichSection(db.prepare(
      'SELECT * FROM sections WHERE act_name = ? AND section_number = ?'
    ).get(actName, sectionNumber));
  }

  static findBySubject(subject) {
    return this.findAll({ subject });
  }

  static create(data) {
    const db = getDb();
    const { v4: uuidv4 } = require('uuid');
    const id = uuidv4();
    const examTags = Array.isArray(data.exam_tags) ? data.exam_tags.join(',') : data.exam_tags;
    const relatedCases = data.related_cases ? JSON.stringify(data.related_cases) : null;
    const relatedSections = data.related_sections ? JSON.stringify(data.related_sections) : null;

    db.prepare(`
      INSERT INTO sections (id, section_number, act_name, act_year, title, text, explanation,
        subject, exam_tags, semester, related_cases, related_sections)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.section_number, data.act_name, data.act_year, data.title, data.text,
      data.explanation, data.subject, examTags, data.semester, relatedCases, relatedSections);
    db.save();
    return this.findById(id);
  }

  static getActsList() {
    const db = getDb();
    return db.prepare('SELECT DISTINCT act_name, act_year, subject, COUNT(*) as section_count FROM sections GROUP BY act_name ORDER BY act_name').all();
  }

  static getStats() {
    const db = getDb();
    return {
      total: db.prepare('SELECT COUNT(*) as count FROM sections').get().count,
      byAct: db.prepare('SELECT act_name, COUNT(*) as count FROM sections GROUP BY act_name ORDER BY count DESC').all(),
      bySubject: db.prepare('SELECT subject, COUNT(*) as count FROM sections GROUP BY subject ORDER BY count DESC').all()
    };
  }
}

module.exports = Section;
