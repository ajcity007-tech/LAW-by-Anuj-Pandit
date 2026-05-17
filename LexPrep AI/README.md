# LexPrep AI - AI-Powered Law Study Platform

> A modern, scalable, AI-powered law study application for Indian law students, judicial services aspirants, APO/officer exam candidates, and advocates.

## Features

- **AI Tutor** - Source-aware legal Q&A with citations
- **Books Library** - Searchable legal book database
- **Notes System** - Topic-wise clickable notes
- **Exam Mode** - Timed mock tests with auto-evaluation
- **Flashcards** - Spaced repetition learning
- **Analytics** - Progress tracking and weak-area detection
- **Admin Dashboard** - Content management system

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
copy .env.example .env

# 3. Initialize database and seed data
npm run seed

# 4. Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

## Project Structure

```
LexPrep AI/
├── server.js              # Express server entry point
├── package.json           # Dependencies and scripts
├── .env.example           # Environment variables template
├── data/                  # JSON seed data
│   ├── books.json
│   ├── topics.json
│   ├── notes.json
│   ├── questions.json
│   └── flashcards.json
├── models/                # Database models
├── routes/                # API route definitions
├── controllers/           # Business logic
├── middleware/            # Auth, validation, error handling
├── public/                # Static frontend files
│   ├── index.html
│   ├── css/styles.css
│   └── js/app.js
└── db/                    # SQLite database (created on seed)
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/books | List all books |
| GET | /api/books/:id | Get book details |
| GET | /api/topics | List topics |
| GET | /api/notes | List notes |
| GET | /api/notes/:id | Get note content |
| POST | /api/ai/chat | AI tutor chat |
| POST | /api/ai/summary | Generate summary |
| POST | /api/ai/mocktest | Generate mock test |
| POST | /api/exam/start | Start exam |
| POST | /api/exam/submit | Submit exam |
| GET | /api/admin/stats | Admin statistics |

## AI Configuration

Set `AI_MOCK_MODE=true` in `.env` for local demo without OpenAI API key.
Set `AI_MOCK_MODE=false` and add your `OPENAI_API_KEY` for real AI responses.

## License

MIT
