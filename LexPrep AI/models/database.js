const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

let db = null;
let SQL = null;
const dbPath = path.join(__dirname, '..', 'db', 'lexprep.db');

function rowToObject(columns, row) {
  const obj = {};
  columns.forEach((col, i) => { obj[col] = row[i]; });
  return obj;
}

class Statement {
  constructor(sql, query) {
    this.sql = sql;
    this.query = query;
  }

  run(...params) {
    this.sql.run(this.query, params);
    return { changes: this.sql.getRowsModified() };
  }

  get(...params) {
    const results = this.sql.exec(this.query, params);
    if (!results.length || !results[0].values.length) return undefined;
    return rowToObject(results[0].columns, results[0].values[0]);
  }

  all(...params) {
    const results = this.sql.exec(this.query, params);
    if (!results.length || !results[0].values.length) return [];
    return results[0].values.map(row => rowToObject(results[0].columns, row));
  }
}

class Database {
  constructor(sqlInstance) {
    this.sql = sqlInstance;
    this.statements = new Map();
  }

  prepare(query) {
    if (!this.statements.has(query)) {
      this.statements.set(query, new Statement(this.sql, query));
    }
    return this.statements.get(query);
  }

  exec(query) {
    this.sql.run(query);
  }

  pragma(query) {
    return this;
  }

  save() {
    try {
      const data = this.sql.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(dbPath, buffer);
    } catch (e) {
      console.error('Failed to save database:', e.message);
    }
  }

  getRowsModified() {
    return this.sql.getRowsModified();
  }
}

async function initDatabase() {
  SQL = await initSqlJs();

  let existingDb = null;
  try {
    if (fs.existsSync(dbPath)) {
      existingDb = fs.readFileSync(dbPath);
    }
  } catch (e) {
    console.log('Creating new database');
  }

  if (existingDb) {
    db = new Database(new SQL.Database(existingDb));
  } else {
    db = new Database(new SQL.Database());
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'student',
      avatar TEXT,
      exam_focus TEXT,
      semester INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT,
      subject TEXT NOT NULL,
      description TEXT,
      exam_tags TEXT,
      semester INTEGER,
      year INTEGER,
      total_chapters INTEGER DEFAULT 0,
      is_open_access INTEGER DEFAULT 0,
      cover_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      book_id TEXT REFERENCES books(id),
      parent_topic_id TEXT REFERENCES topics(id),
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      content TEXT,
      summary TEXT,
      exam_tags TEXT,
      semester INTEGER,
      difficulty TEXT DEFAULT 'medium',
      order_index INTEGER DEFAULT 0,
      topic_path TEXT,
      related_topics TEXT,
      prerequisites TEXT,
      key_sections TEXT,
      key_cases TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      topic_id TEXT REFERENCES topics(id),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      subject TEXT NOT NULL,
      exam_tags TEXT,
      semester INTEGER,
      tags TEXT,
      is_bookmarked INTEGER DEFAULT 0,
      overview TEXT,
      why_it_matters TEXT,
      definition_rule TEXT,
      statutory_basis TEXT,
      key_provisions TEXT,
      leading_cases TEXT,
      irac_analysis TEXT,
      exam_explanation TEXT,
      quick_revision_bullets TEXT,
      deep_revision_summary TEXT,
      mcqs TEXT,
      long_answer_outline TEXT,
      related_topics TEXT,
      citations TEXT,
      confidence_score REAL DEFAULT 0.5,
      topic_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      topic_id TEXT REFERENCES topics(id),
      type TEXT NOT NULL,
      question TEXT NOT NULL,
      options TEXT,
      correct_answer TEXT,
      explanation TEXT,
      subject TEXT NOT NULL,
      exam_tags TEXT,
      semester INTEGER,
      difficulty TEXT DEFAULT 'medium',
      marks INTEGER DEFAULT 1,
      source_reference TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      exam_type TEXT NOT NULL,
      subject TEXT,
      duration_minutes INTEGER DEFAULT 60,
      total_marks INTEGER,
      passing_marks INTEGER,
      question_ids TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS test_results (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      test_id TEXT REFERENCES tests(id),
      score INTEGER,
      total_marks INTEGER,
      percentage REAL,
      answers TEXT,
      time_taken_minutes INTEGER,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS flashcards (
      id TEXT PRIMARY KEY,
      front TEXT NOT NULL,
      back TEXT NOT NULL,
      subject TEXT NOT NULL,
      exam_tags TEXT,
      semester INTEGER,
      difficulty TEXT DEFAULT 'medium',
      repetition INTEGER DEFAULT 0,
      interval_days INTEGER DEFAULT 1,
      ease_factor REAL DEFAULT 2.5,
      next_review DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_flashcard_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      flashcard_id TEXT REFERENCES flashcards(id),
      status TEXT DEFAULT 'new',
      last_reviewed DATETIME,
      next_review DATETIME,
      repetitions INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      item_type TEXT NOT NULL,
      item_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS ai_chat_history (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      messages TEXT NOT NULL,
      topic TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS search_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      query TEXT NOT NULL,
      results_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS study_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      subject TEXT NOT NULL,
      topics_completed INTEGER DEFAULT 0,
      topics_total INTEGER DEFAULT 0,
      last_studied DATETIME,
      streak_days INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      topic_id TEXT REFERENCES topics(id),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      subject TEXT NOT NULL,
      exam_tags TEXT,
      semester INTEGER,
      tags TEXT,
      is_bookmarked INTEGER DEFAULT 0,
      overview TEXT,
      why_it_matters TEXT,
      definition_rule TEXT,
      statutory_basis TEXT,
      key_provisions TEXT,
      leading_cases TEXT,
      irac_analysis TEXT,
      exam_explanation TEXT,
      quick_revision_bullets TEXT,
      deep_revision_summary TEXT,
      mcqs TEXT,
      long_answer_outline TEXT,
      related_topics TEXT,
      citations TEXT,
      confidence_score REAL DEFAULT 0.5,
      topic_path TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS doctrines (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      subject TEXT NOT NULL,
      origin_case TEXT,
      origin_case_citation TEXT,
      key_cases TEXT,
      application TEXT,
      exam_tags TEXT,
      semester INTEGER,
      related_sections TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS landmark_cases (
      id TEXT PRIMARY KEY,
      case_name TEXT NOT NULL,
      citation TEXT NOT NULL,
      court TEXT,
      year INTEGER,
      subject TEXT NOT NULL,
      bench_strength TEXT,
      facts TEXT,
      issues TEXT,
      holding TEXT,
      ratio TEXT,
      significance TEXT,
      exam_tags TEXT,
      semester INTEGER,
      related_sections TEXT,
      related_doctrines TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sections (
      id TEXT PRIMARY KEY,
      section_number TEXT NOT NULL,
      act_name TEXT NOT NULL,
      act_year INTEGER,
      title TEXT,
      text TEXT,
      explanation TEXT,
      subject TEXT NOT NULL,
      exam_tags TEXT,
      semester INTEGER,
      related_cases TEXT,
      related_sections TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS topic_graph (
      id TEXT PRIMARY KEY,
      from_topic_id TEXT REFERENCES topics(id),
      to_topic_id TEXT REFERENCES topics(id),
      relation_type TEXT NOT NULL,
      strength REAL DEFAULT 1.0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS document_chunks (
      id TEXT PRIMARY KEY,
      source_type TEXT NOT NULL,
      source_id TEXT NOT NULL,
      chunk_index INTEGER DEFAULT 0,
      content TEXT NOT NULL,
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cached_summaries (
      id TEXT PRIMARY KEY,
      source_type TEXT NOT NULL,
      source_id TEXT NOT NULL,
      summary TEXT NOT NULL,
      key_points TEXT,
      generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      event_type TEXT NOT NULL,
      event_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_books_subject ON books(subject);
    CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subject);
    CREATE INDEX IF NOT EXISTS idx_notes_subject ON notes(subject);
    CREATE INDEX IF NOT EXISTS idx_questions_subject ON questions(subject);
    CREATE INDEX IF NOT EXISTS idx_flashcards_subject ON flashcards(subject);

    CREATE INDEX IF NOT EXISTS idx_notes_exam_tags ON notes(exam_tags);
    CREATE INDEX IF NOT EXISTS idx_notes_semester ON notes(semester);
    CREATE INDEX IF NOT EXISTS idx_doctrines_subject ON doctrines(subject);
    CREATE INDEX IF NOT EXISTS idx_landmark_cases_subject ON landmark_cases(subject);
    CREATE INDEX IF NOT EXISTS idx_sections_subject ON sections(subject);
    CREATE INDEX IF NOT EXISTS idx_sections_act ON sections(act_name);
    CREATE INDEX IF NOT EXISTS idx_topic_graph_from ON topic_graph(from_topic_id);
    CREATE INDEX IF NOT EXISTS idx_topic_graph_to ON topic_graph(to_topic_id);
    CREATE INDEX IF NOT EXISTS idx_document_chunks_source ON document_chunks(source_type, source_id);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
    CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
  `);

  db.save();
}

function getDb() {
  return db;
}

module.exports = { db, initDatabase, getDb, Database };
