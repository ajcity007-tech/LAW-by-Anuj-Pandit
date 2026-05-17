-- LexPrep AI - PostgreSQL Production Schema
-- Run this to set up the database on PostgreSQL

-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin', 'teacher')),
  avatar VARCHAR(500),
  exam_focus VARCHAR(100),
  semester INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  author VARCHAR(255),
  subject VARCHAR(100) NOT NULL,
  description TEXT,
  exam_tags VARCHAR(500),
  semester INTEGER,
  year INTEGER,
  total_chapters INTEGER DEFAULT 0,
  is_open_access BOOLEAN DEFAULT FALSE,
  cover_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topics
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID REFERENCES books(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  content TEXT,
  summary TEXT,
  exam_tags VARCHAR(500),
  semester INTEGER,
  difficulty VARCHAR(10) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  subject VARCHAR(100) NOT NULL,
  exam_tags VARCHAR(500),
  semester INTEGER,
  tags VARCHAR(500),
  is_bookmarked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE SET NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('mcq', 'short', 'long', 'case_study')),
  question TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT,
  explanation TEXT,
  subject VARCHAR(100) NOT NULL,
  exam_tags VARCHAR(500),
  semester INTEGER,
  difficulty VARCHAR(10) DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  marks INTEGER DEFAULT 1,
  source_reference VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tests
CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  exam_type VARCHAR(50) NOT NULL,
  subject VARCHAR(100),
  duration_minutes INTEGER DEFAULT 60,
  total_marks INTEGER,
  passing_marks INTEGER,
  question_ids TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Results
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  score INTEGER,
  total_marks INTEGER,
  percentage DECIMAL(5, 2),
  answers JSONB,
  time_taken_minutes INTEGER,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Flashcards
CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  subject VARCHAR(100) NOT NULL,
  exam_tags VARCHAR(500),
  semester INTEGER,
  difficulty VARCHAR(10) DEFAULT 'medium',
  repetition INTEGER DEFAULT 0,
  interval_days INTEGER DEFAULT 1,
  ease_factor DECIMAL(3, 1) DEFAULT 2.5,
  next_review DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Flashcard Progress
CREATE TABLE user_flashcard_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  flashcard_id UUID REFERENCES flashcards(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'learning', 'review', 'mastered')),
  last_reviewed DATE,
  next_review DATE,
  repetitions INTEGER DEFAULT 0,
  interval_days INTEGER DEFAULT 1,
  ease_factor DECIMAL(3, 1) DEFAULT 2.5,
  UNIQUE(user_id, flashcard_id)
);

-- Bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('book', 'topic', 'note', 'question')),
  item_id VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, item_type, item_id)
);

-- AI Chat History
CREATE TABLE ai_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  messages JSONB NOT NULL,
  topic VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Search Logs
CREATE TABLE search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  query VARCHAR(500) NOT NULL,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Study Progress
CREATE TABLE study_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  topics_completed INTEGER DEFAULT 0,
  topics_total INTEGER DEFAULT 0,
  last_studied TIMESTAMP,
  streak_days INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_books_subject ON books(subject);
CREATE INDEX idx_books_exam_tags ON books(exam_tags);
CREATE INDEX idx_topics_subject ON topics(subject);
CREATE INDEX idx_topics_book_id ON topics(book_id);
CREATE INDEX idx_notes_subject ON notes(subject);
CREATE INDEX idx_notes_topic_id ON notes(topic_id);
CREATE INDEX idx_questions_subject ON questions(subject);
CREATE INDEX idx_questions_type ON questions(type);
CREATE INDEX idx_tests_exam_type ON tests(exam_type);
CREATE INDEX idx_flashcards_subject ON flashcards(subject);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_study_progress_user ON study_progress(user_id);
CREATE INDEX idx_test_results_user ON test_results(user_id);

-- Full-text search (PostgreSQL)
CREATE INDEX idx_books_fts ON books USING gin(to_tsvector('english', title || ' ' || COALESCE(author, '') || ' ' || COALESCE(description, '')));
CREATE INDEX idx_topics_fts ON topics USING gin(to_tsvector('english', title || ' ' || COALESCE(content, '') || ' ' || COALESCE(summary, '')));
CREATE INDEX idx_notes_fts ON notes USING gin(to_tsvector('english', title || ' ' || content));
CREATE INDEX idx_questions_fts ON questions USING gin(to_tsvector('english', question || ' ' || COALESCE(explanation, '')));

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_progress_updated_at BEFORE UPDATE ON study_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
