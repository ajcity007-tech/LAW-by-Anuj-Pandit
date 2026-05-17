const API = '';
let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user') || 'null');
let currentPage = 'dashboard';
let authMode = 'login';
let currentNoteId = null;
let examTimer = null;
let flashcardIndex = 0;
let flashcards = [];

async function api(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${endpoint}`, { ...options, headers: { ...headers, ...options.headers } });
  const data = await res.json();

  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const pageEl = document.getElementById(`page-${page}`);
  const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);

  if (pageEl) pageEl.classList.add('active');
  if (navEl) navEl.classList.add('active');

  currentPage = page;
  loadPage(page);

  if (window.innerWidth < 768) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

async function loadPage(page) {
  const content = document.getElementById(`page-${page}`);
  if (!content) return;

  switch (page) {
    case 'dashboard': await loadDashboard(content); break;
    case 'books': await loadBooks(content); break;
    case 'topics': await loadTopics(content); break;
    case 'notes': await loadNotes(content); break;
    case 'knowledge': await loadKnowledgeBase(content); break;
    case 'ai-tutor': loadAITutor(content); break;
    case 'exams': await loadExams(content); break;
    case 'flashcards': await loadFlashcards(content); break;
    case 'analytics': await loadAnalytics(content); break;
    case 'bookmarks': await loadBookmarks(content); break;
    case 'admin': await loadAdmin(content); break;
  }
}

async function loadDashboard(el) {
  try {
    const dashboardRes = await api('/api/knowledge/dashboard').catch(() => null);
    const data = dashboardRes?.data;

    if (!data) {
      const [books, topics, notes, questions] = await Promise.all([
        api('/api/books').catch(() => ({ data: [] })),
        api('/api/topics').catch(() => ({ data: [] })),
        api('/api/notes').catch(() => ({ data: [] })),
        api('/api/questions').catch(() => ({ data: [] }))
      ]);
      renderFallbackDashboard(el, books.data, topics.data, notes.data, questions.data);
      return;
    }

    const { stats, subjects, exam_types, recent_notes, bookmarked_notes, revision_queue, weak_areas, ai_recommendations, today_focus } = data;

    el.innerHTML = `
      <h1 class="page-title">&#9878; LexPrep AI Study Cockpit</h1>
      <p class="page-description">High-density legal knowledge system for Indian law students, judicial aspirants, and advocates.</p>

      <div class="grid grid-4" style="margin-bottom: 20px;">
        <div class="card stat-card">
          <div class="stat-value">${stats.books.total}</div>
          <div class="stat-label">Books</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">${stats.topics.total}</div>
          <div class="stat-label">Topics</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">${stats.notes.total}</div>
          <div class="stat-label">Notes</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">${stats.cases.total}</div>
          <div class="stat-label">Landmark Cases</div>
        </div>
      </div>

      <div class="grid grid-4" style="margin-bottom: 20px;">
        <div class="card stat-card">
          <div class="stat-value">${stats.doctrines.total}</div>
          <div class="stat-label">Doctrines</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">${stats.sections.total}</div>
          <div class="stat-label">Sections</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">${stats.notes.bookmarked}</div>
          <div class="stat-label">Bookmarked</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">${stats.notes.withStructuredData}</div>
          <div class="stat-label">Structured Notes</div>
        </div>
      </div>

      ${today_focus ? `
      <div class="card" style="margin-bottom: 20px; border-left: 4px solid var(--accent);">
        <h3 class="card-title">&#127919; Today's Focus</h3>
        <div class="card-body">
          <p><strong>Subject:</strong> <span class="subject-tag">${today_focus.suggested_subject || 'Constitutional Law'}</span></p>
          <p style="margin-top: 4px;">${today_focus.suggested_action}</p>
        </div>
      </div>
      ` : ''}

      <div class="grid grid-2">
        <div class="card">
          <h3 class="card-title">&#128218; Subject Coverage</h3>
          <div class="card-body">
            ${subjects.map(s => `
              <div style="margin-bottom: 10px;">
                <div style="display:flex;justify-content:space-between;font-size:13px;">
                  <span class="subject-tag">${s.subject}</span>
                  <span class="badge badge-primary">${s.topics} topics, ${s.notes} notes</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${s.completion}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <h3 class="card-title">&#9889; Quick Actions</h3>
          <div class="card-body">
            <div class="grid grid-2">
              <div class="card card-clickable" onclick="navigateTo('ai-tutor')" style="text-align:center;padding:12px;border-top:3px solid var(--accent);">
                <div style="font-weight:600;font-size:13px;">&#9878; Ask AI Tutor</div>
              </div>
              <div class="card card-clickable" onclick="navigateTo('exams')" style="text-align:center;padding:12px;border-top:3px solid var(--warning);">
                <div style="font-weight:600;font-size:13px;">&#9876; Mock Test</div>
              </div>
              <div class="card card-clickable" onclick="navigateTo('flashcards')" style="text-align:center;padding:12px;border-top:3px solid var(--success);">
                <div style="font-weight:600;font-size:13px;">&#128214; Flashcards</div>
              </div>
              <div class="card card-clickable" onclick="navigateTo('notes')" style="text-align:center;padding:12px;border-top:3px solid var(--primary);">
                <div style="font-weight:600;font-size:13px;">&#128221; Notes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${weak_areas.length > 0 ? `
      <div class="card" style="margin-top: 20px; border-left: 4px solid var(--danger);">
        <h3 class="card-title">&#9888; Weak Areas - Priority Review</h3>
        <div class="card-body">
          ${weak_areas.map(w => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid var(--border);">
              <span class="subject-tag">${w.subject}</span>
              <span class="badge badge-danger">${w.completion}% coverage</span>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <div class="grid grid-2" style="margin-top: 20px;">
        <div class="card">
          <h3 class="card-title">&#128203; Revision Queue</h3>
          <div class="card-body">
            ${revision_queue.length ? revision_queue.map(n => `
              <div class="card card-clickable" onclick="openNote('${n.id}')" style="margin-bottom:8px;border-left:3px solid var(--warning);">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <div>
                    <div style="font-weight:600;font-size:13px;">${n.title}</div>
                    <div style="font-size:12px;color:var(--text-secondary);">${n.subject}</div>
                  </div>
                  <span class="badge badge-warning">${n.confidence_score ? Math.round(n.confidence_score * 100) : 50}%</span>
                </div>
              </div>
            `).join('') : '<p style="font-size:13px;color:var(--text-secondary);">No items in revision queue.</p>'}
          </div>
        </div>

        <div class="card">
          <h3 class="card-title">&#128278; Recent Bookmarks</h3>
          <div class="card-body">
            ${bookmarked_notes.length ? bookmarked_notes.map(n => `
              <div class="card card-clickable" onclick="openNote('${n.id}')" style="margin-bottom:8px;border-left:3px solid var(--success);">
                <div style="font-weight:600;font-size:13px;">${n.title}</div>
                <div style="font-size:12px;color:var(--text-secondary);">${n.subject}</div>
              </div>
            `).join('') : '<p style="font-size:13px;color:var(--text-secondary);">No bookmarks yet.</p>'}
          </div>
        </div>
      </div>

      ${ai_recommendations.length ? `
      <div class="card" style="margin-top: 20px;">
        <h3 class="card-title">&#128161; AI Recommendations</h3>
        <div class="card-body">
          ${ai_recommendations.map(r => `
            <div style="padding:8px 0;border-bottom:1px solid var(--border);">
              <span class="badge badge-${r.priority === 'high' ? 'danger' : r.priority === 'medium' ? 'warning' : 'success'}">${r.priority}</span>
              <strong style="margin-left:8px;">${r.title}</strong>
              <p style="font-size:13px;color:var(--text-secondary);margin:4px 0 0 0;">${r.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <div class="card" style="margin-top: 20px;">
        <h3 class="card-title">&#128218; Browse by Exam Type</h3>
        <div class="card-body">
          <div class="grid grid-4">
            ${exam_types.map(e => `
              <div class="card card-clickable" onclick="filterByExam('${e}')" style="text-align:center;padding:12px;border-top:3px solid var(--accent);">
                <div style="font-weight:600;font-size:13px;">${e}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">&#9888;</div><p>Failed to load dashboard. Please refresh.</p></div>`;
  }
}

function renderFallbackDashboard(el, books, topics, notes, questions) {
  const subjects = [...new Set(books.map(b => b.subject))];
  const examTypes = ['UP PCS-J', 'Judicial Services', 'Civil Judge', 'Bar Exam', 'UPSC'];

  el.innerHTML = `
    <h1 class="page-title">&#9878; UP PCS-J Judiciary Exam Portal</h1>
    <p class="page-description">AI-powered legal study platform for UP PCS-J, Judicial Services, and Civil Judge examinations.</p>

    <div class="grid grid-4" style="margin-bottom: 24px;">
      <div class="card stat-card"><div class="stat-value">${books.length}</div><div class="stat-label">Master Books</div></div>
      <div class="card stat-card"><div class="stat-value">${topics.length}</div><div class="stat-label">Study Topics</div></div>
      <div class="card stat-card"><div class="stat-value">${notes.length}</div><div class="stat-label">Expert Notes</div></div>
      <div class="card stat-card"><div class="stat-value">${questions.length}</div><div class="stat-label">PYQs & Practice</div></div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3 class="card-title">&#128218; Subjects</h3>
        <div class="card-body">
          ${subjects.map(s => `
            <div style="margin-bottom: 12px;">
              <div style="display:flex;justify-content:space-between;font-size:14px;">
                <span class="subject-tag">${s}</span>
                <span class="badge badge-primary">${topics.filter(t => t.subject === s).length} topics</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${Math.min(100, (topics.filter(t => t.subject === s).length / 5) * 100)}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <h3 class="card-title">&#9876; Exam Preparation</h3>
        <div class="card-body">
          <div class="grid grid-2">
            ${examTypes.map(e => `
              <div class="card card-clickable" onclick="filterByExam('${e}')" style="text-align:center;padding:16px;border-top:3px solid var(--accent);">
                <div style="font-weight:600;font-size:14px;">${e}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

async function loadBooks(el) {
  try {
    const res = await api('/api/books');
    const subjects = [...new Set(res.data.map(b => b.subject))];

    el.innerHTML = `
      <h1 class="page-title">&#128218; Master Books Library</h1>
      <p class="page-description">Authoritative legal texts for UP PCS-J: J.N. Pandey, C.K. Takwani, Batuklal, Ratanlal & Dhirajlal, and more.</p>

      <div class="filter-bar">
        <select id="bookSubjectFilter" onchange="filterBooks()">
          <option value="">All Subjects</option>
          ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
        <select id="bookSemesterFilter" onchange="filterBooks()">
          <option value="">All Semesters</option>
          ${[1,2,3,4,5,6].map(s => `<option value="${s}">Semester ${s}</option>`).join('')}
        </select>
        <input type="text" id="bookSearchFilter" placeholder="Search books..." oninput="filterBooks()">
      </div>

      <div class="grid grid-3" id="booksGrid">
        ${res.data.map(b => `
          <div class="card card-clickable book-card" data-subject="${b.subject}" data-semester="${b.semester}" onclick="openBook('${b.id}')" style="border-top:3px solid var(--accent);">
            <div class="card-header">
              <span class="badge badge-primary">${b.subject}</span>
              ${b.is_open_access ? '<span class="badge badge-success">Open Access</span>' : ''}
            </div>
            <div class="card-title">${b.title}</div>
            <div class="card-subtitle">&#9998; ${b.author}</div>
            <div class="card-body">
              <p style="font-size:13px;color:var(--text-secondary);">${b.description?.substring(0, 120)}...</p>
              <div style="margin-top:8px;">
                ${b.exam_tags?.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('')}
              </div>
            </div>
            <div class="card-footer" style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-muted);">
              <span>Semester ${b.semester}</span>
              <span>${b.total_chapters} chapters</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><p>Failed to load books.</p></div>`;
  }
}

function filterBooks() {
  const subject = document.getElementById('bookSubjectFilter').value;
  const semester = document.getElementById('bookSemesterFilter').value;
  const search = document.getElementById('bookSearchFilter').value.toLowerCase();

  document.querySelectorAll('.book-card').forEach(card => {
    const matchSubject = !subject || card.dataset.subject === subject;
    const matchSemester = !semester || card.dataset.semester === semester;
    const matchSearch = !search || card.textContent.toLowerCase().includes(search);
    card.style.display = (matchSubject && matchSemester && matchSearch) ? '' : 'none';
  });
}

function filterByExam(examType) {
  navigateTo('books');
  setTimeout(() => {
    const input = document.getElementById('bookSearchFilter');
    if (input) { input.value = examType; filterBooks(); }
  }, 100);
}

async function openBook(id) {
  try {
    const res = await api(`/api/books/${id}`);
    const book = res.data;

    const el = document.getElementById('page-books');
    el.innerHTML = `
      <button class="btn btn-outline btn-sm" onclick="loadPage('books')" style="margin-bottom:16px;">&larr; Back to Books</button>
      <h1 class="page-title">${book.title}</h1>
      <p class="page-description">&#9998; ${book.author} | ${book.subject} | Semester ${book.semester}</p>
      <p style="margin-bottom:24px;">${book.description}</p>

      <div style="margin-bottom:16px;">
        ${book.exam_tags?.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('')}
      </div>

      <h2 class="section-title">&#128214; Chapters / Topics</h2>
      <div id="bookChapters">
        <p style="color:var(--text-secondary);">Loading chapters...</p>
      </div>
    `;

    try {
      const topicsRes = await api(`/api/topics?book_id=${id}`);
      const chapters = topicsRes.data;

      const chaptersEl = document.getElementById('bookChapters');
      if (chapters.length === 0) {
        chaptersEl.innerHTML = '<div class="empty-state"><p>No chapters available for this book yet.</p></div>';
        return;
      }

      chaptersEl.innerHTML = `
        <div class="grid grid-2">
          ${chapters.map((c, i) => `
            <div class="card card-clickable" onclick="openTopic('${c.id}')" style="border-left:3px solid var(--accent);">
              <div class="card-header">
                <span class="badge badge-${c.difficulty === 'easy' ? 'success' : c.difficulty === 'hard' ? 'danger' : 'warning'}">${c.difficulty}</span>
                <span class="badge badge-primary">Chapter ${i + 1}</span>
              </div>
              <div class="card-title">${c.title}</div>
              <div class="card-subtitle">${c.summary?.substring(0, 100) || ''}...</div>
            </div>
          `).join('')}
        </div>
      `;
    } catch (err) {
      document.getElementById('bookChapters').innerHTML = '<p style="color:var(--danger);">Failed to load chapters.</p>';
    }
  } catch (err) {
    showToast('Failed to load book', 'error');
  }
}

async function loadTopics(el) {
  try {
    const hierarchyRes = await api('/api/knowledge/hierarchy').catch(() => ({ data: [] }));
    const hierarchy = hierarchyRes.data || [];

    el.innerHTML = `
      <h1 class="page-title">&#128214; Topic Browser</h1>
      <p class="page-description">Hierarchical taxonomy: Subject &#8594; Book &#8594; Chapter &#8594; Subtopic. Click any item to explore.</p>

      <div class="filter-bar">
        <select id="topicSubjectFilter" onchange="filterTopicHierarchy()">
          <option value="">All Subjects</option>
          ${hierarchy.map(h => `<option value="${h.subject}">${h.subject}</option>`).join('')}
        </select>
        <input type="text" id="topicSearchFilter" placeholder="Search topics..." oninput="filterTopicHierarchy()">
      </div>

      <div id="topicHierarchy">
        ${hierarchy.map(h => renderSubjectHierarchy(h)).join('')}
      </div>
    `;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><p>Failed to load topics.</p></div>`;
  }
}

function renderSubjectHierarchy(h) {
  return `
    <div class="card subject-hierarchy" data-subject="${h.subject}" style="margin-bottom: 16px;">
      <h3 class="card-title" onclick="toggleSubjectHierarchy(this)" style="cursor:pointer;">
        &#128218; ${h.subject}
        <span class="badge badge-primary">${h.chapters?.length || 0} chapters</span>
      </h3>
      <div class="hierarchy-content" style="display:none;">
        ${h.chapters?.map(chapter => `
          <div style="margin: 8px 0 8px 16px;">
            <div class="card card-clickable" onclick="openTopic('${chapter.id}')" style="border-left:3px solid var(--accent);margin-bottom:4px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <div style="font-weight:600;font-size:14px;">&#128214; ${chapter.title}</div>
                  <div style="font-size:12px;color:var(--text-secondary);">${chapter.summary?.substring(0, 100) || ''}...</div>
                </div>
                <span class="badge badge-${chapter.difficulty === 'easy' ? 'success' : chapter.difficulty === 'hard' ? 'danger' : 'warning'}">${chapter.difficulty}</span>
              </div>
            </div>
            ${chapter.children?.length ? `
              <div style="margin-left: 24px;">
                ${chapter.children.map(sub => `
                  <div class="card card-clickable" onclick="openTopic('${sub.id}')" style="border-left:3px solid var(--text-muted);margin-bottom:4px;padding:8px 12px;">
                    <div style="font-size:13px;font-weight:500;">&#8627; ${sub.title}</div>
                    <div style="font-size:11px;color:var(--text-secondary);">${sub.summary?.substring(0, 80) || ''}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        `).join('') || '<p style="padding:8px 16px;color:var(--text-secondary);">No chapters loaded. Run seed script to populate topics.</p>'}
      </div>
    </div>
  `;
}

function toggleSubjectHierarchy(el) {
  const content = el.nextElementSibling;
  if (content) {
    content.style.display = content.style.display === 'none' ? 'block' : 'none';
  }
}

function filterTopicHierarchy() {
  const subject = document.getElementById('topicSubjectFilter')?.value || '';
  const search = document.getElementById('topicSearchFilter')?.value.toLowerCase() || '';

  document.querySelectorAll('.subject-hierarchy').forEach(card => {
    const matchSubject = !subject || card.dataset.subject === subject;
    const matchSearch = !search || card.textContent.toLowerCase().includes(search);
    card.style.display = (matchSubject && matchSearch) ? '' : 'none';
  });
}

async function openTopic(id) {
  try {
    const res = await api(`/api/topics/${id}`);
    const topic = res.data;

    const el = document.getElementById('page-topics');
    el.innerHTML = `
      <div class="topic-reader">
        <div class="reader-header">
          <button class="btn btn-outline btn-sm" onclick="loadPage('topics')" style="margin-bottom:16px;">&larr; Back to Topics</button>
          <div class="reader-meta">
            <span class="badge badge-primary">${topic.subject}</span>
            <span class="badge badge-${topic.difficulty === 'easy' ? 'success' : topic.difficulty === 'hard' ? 'danger' : 'warning'}">${topic.difficulty}</span>
            ${topic.book_title ? `<span class="badge badge-gold">${topic.book_title}</span>` : ''}
          </div>
        </div>

        <h1 class="reader-title">${topic.title}</h1>
        ${topic.summary ? `<p class="reader-summary">${topic.summary}</p>` : ''}

        <div class="reader-content">${renderRichContent(topic.content)}</div>

        ${topic.notes?.length ? `
          <div class="reader-section">
            <h2 class="section-title">&#128221; Related Notes</h2>
            <div class="grid grid-2">
              ${topic.notes.map(n => `
                <div class="card card-clickable" onclick="openNote('${n.id}')" style="border-left:3px solid var(--accent);">
                  <div class="card-title">${n.title}</div>
                  <div class="card-subtitle">${n.subject}</div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${topic.questions?.length ? `
          <div class="reader-section">
            <h2 class="section-title">&#9876; Practice Questions & PYQs</h2>
            <div class="grid grid-2">
              ${topic.questions.map(q => `
                <div class="card">
                  <div class="card-header">
                    <span class="badge badge-${q.type === 'mcq' ? 'primary' : q.type === 'short' ? 'warning' : 'danger'}">${q.type.toUpperCase()}</span>
                    <span class="badge badge-${q.difficulty === 'easy' ? 'success' : q.difficulty === 'hard' ? 'danger' : 'warning'}">${q.difficulty}</span>
                  </div>
                  <div class="question-text">${q.question}</div>
                  <details style="margin-top:8px;">
                    <summary style="cursor:pointer;color:var(--primary);font-size:13px;">Show Answer</summary>
                    <div class="note-content" style="margin-top:8px;font-size:13px;">${formatContent(q.explanation)}</div>
                  </details>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  } catch (err) {
    showToast('Failed to load topic', 'error');
  }
}

function renderRichContent(content) {
  if (!content) return '';

  let html = content;

  html = html.replace(/^### (.*$)/gm, '<h3 class="reader-h3">$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="reader-h2">$1</h2>');
  html = html.replace(/^#### (.*$)/gm, '<h4 class="reader-h4">$1</h4>');

  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

  html = html.replace(/^> (.*$)/gm, '<blockquote class="reader-blockquote">$1</blockquote>');

  html = html.replace(/^\d+\.\s+\*\*(.*?)\*\*:\s*(.*$)/gm, '<div class="reader-list-item"><strong>$1:</strong> $2</div>');
  html = html.replace(/^\d+\.\s+(.*$)/gm, '<div class="reader-list-item">$1</div>');
  html = html.replace(/^- (.*$)/gm, '<div class="reader-list-item-bullet">$1</div>');

  html = html.replace(/\|(.*)\|/g, (match) => {
    const cells = match.split('|').filter(c => c.trim());
    if (cells.length < 2) return match;
    return '<table class="reader-table"><tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr></table>';
  });

  html = html.replace(/\n\n/g, '</p><p class="reader-paragraph">');
  html = html.replace(/\n/g, '<br>');

  html = '<p class="reader-paragraph">' + html + '</p>';

  html = html.replace(/<p class="reader-paragraph"><\/p>/g, '');
  html = html.replace(/<p class="reader-paragraph"><(h[234]|blockquote|div|table)/g, '<$1');
  html = html.replace(/<\/(h[234]|blockquote|div|table)><\/p>/g, '</$1>');

  return html;
}
}

async function loadNotes(el) {
  try {
    const res = await api('/api/notes');
    const subjects = [...new Set(res.data.map(n => n.subject))];

    el.innerHTML = `
      <h1 class="page-title">&#128221; Structured Legal Notes</h1>
      <p class="page-description">Comprehensive notes with case law, statutory provisions, IRAC analysis, and exam-focused content. Click any note to expand.</p>

      <div class="filter-bar">
        <select id="noteSubjectFilter" onchange="filterNotes()">
          <option value="">All Subjects</option>
          ${subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
        </select>
        <select id="noteExamFilter" onchange="filterNotes()">
          <option value="">All Exams</option>
          <option value="UP PCS-J">UP PCS-J</option>
          <option value="Judicial Services">Judicial Services</option>
          <option value="Civil Judge">Civil Judge</option>
          <option value="Bar Exam">Bar Exam</option>
          <option value="APO">APO</option>
          <option value="UPSC">UPSC</option>
        </select>
        <input type="text" id="noteSearchFilter" placeholder="Search notes..." oninput="filterNotes()">
      </div>

      <div class="grid grid-2" id="notesGrid">
        ${res.data.map(n => renderNoteCard(n)).join('')}
      </div>
    `;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><p>Failed to load notes.</p></div>`;
  }
}

function renderNoteCard(n) {
  const examTags = n.exam_tags ? n.exam_tags.split(',').map(t => t.trim()).slice(0, 3) : [];
  const hasStructured = n.overview || n.leading_cases || n.statutory_basis;

  return `
    <div class="card note-card" data-subject="${n.subject}" data-exam="${n.exam_tags || ''}" onclick="openNote('${n.id}')">
      <div class="card-header">
        <span class="badge badge-primary">${n.subject}</span>
        ${n.is_bookmarked ? '<span class="badge badge-success">&#128278;</span>' : ''}
        ${hasStructured ? '<span class="badge badge-gold">Structured</span>' : ''}
      </div>
      <div class="card-title">${n.title}</div>
      <div class="card-subtitle">${n.topic_title || ''}</div>
      <div style="margin-top:8px;">
        ${examTags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      ${n.overview ? `<p style="font-size:12px;color:var(--text-secondary);margin-top:8px;">${n.overview.substring(0, 100)}...</p>` : ''}
    </div>
  `;
}

function filterNotes() {
  const subject = document.getElementById('noteSubjectFilter')?.value || '';
  const exam = document.getElementById('noteExamFilter')?.value || '';
  const search = document.getElementById('noteSearchFilter')?.value.toLowerCase() || '';

  document.querySelectorAll('.note-card').forEach(card => {
    const matchSubject = !subject || card.dataset.subject === subject;
    const matchExam = !exam || (card.dataset.exam && card.dataset.exam.includes(exam));
    const matchSearch = !search || card.textContent.toLowerCase().includes(search);
    card.style.display = (matchSubject && matchExam && matchSearch) ? '' : 'none';
  });
}

async function openNote(id) {
  try {
    const res = await api(`/api/notes/${id}`);
    const note = res.data;
    currentNoteId = id;

    document.getElementById('noteModalTitle').textContent = note.title;
    document.getElementById('noteModalMeta').innerHTML = `
      <span class="badge badge-primary">${note.subject}</span>
      ${note.exam_tags?.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('')}
      ${note.confidence_score ? `<span class="badge badge-${note.confidence_score > 0.7 ? 'success' : 'warning'}">${Math.round(note.confidence_score * 100)}% coverage</span>` : ''}
    `;

    let contentHtml = '';

    if (note.overview) {
      contentHtml += `<div class="note-section"><h4>&#128203; Overview</h4><p>${formatContent(note.overview)}</p></div>`;
    }
    if (note.why_it_matters) {
      contentHtml += `<div class="note-section"><h4>&#11088; Why It Matters</h4><p>${formatContent(note.why_it_matters)}</p></div>`;
    }
    if (note.definition_rule) {
      contentHtml += `<div class="note-section"><h4>&#128220; Definition / Rule</h4><p>${formatContent(note.definition_rule)}</p></div>`;
    }
    if (note.statutory_basis) {
      contentHtml += `<div class="note-section"><h4>&#128218; Statutory Basis</h4><p>${formatContent(note.statutory_basis)}</p></div>`;
    }
    if (note.key_provisions) {
      contentHtml += `<div class="note-section"><h4>&#128206; Key Provisions</h4><p>${formatContent(note.key_provisions)}</p></div>`;
    }
    if (note.leading_cases) {
      const cases = typeof note.leading_cases === 'string' ? JSON.parse(note.leading_cases) : note.leading_cases;
      if (cases && cases.length) {
        contentHtml += `<div class="note-section"><h4>&#9878; Leading Cases</h4><ul>${cases.map(c => `<li>${typeof c === 'string' ? c : `${c.name || ''} ${c.citation || ''}`}</li>`).join('')}</ul></div>`;
      }
    }
    if (note.irac_analysis) {
      contentHtml += `<div class="note-section"><h4>&#128221; IRAC Analysis</h4><p>${formatContent(note.irac_analysis)}</p></div>`;
    }
    if (note.exam_explanation) {
      contentHtml += `<div class="note-section"><h4>&#9876; Exam-Ready Explanation</h4><p>${formatContent(note.exam_explanation)}</p></div>`;
    }
    if (note.quick_revision_bullets) {
      const bullets = typeof note.quick_revision_bullets === 'string' ? JSON.parse(note.quick_revision_bullets) : note.quick_revision_bullets;
      if (bullets && bullets.length) {
        contentHtml += `<div class="note-section"><h4>&#9889; Quick Revision Bullets</h4><ul>${bullets.map(b => `<li>${b}</li>`).join('')}</ul></div>`;
      }
    }
    if (note.deep_revision_summary) {
      contentHtml += `<div class="note-section"><h4>&#128218; Deep Revision Summary</h4><p>${formatContent(note.deep_revision_summary)}</p></div>`;
    }
    if (note.long_answer_outline) {
      contentHtml += `<div class="note-section"><h4>&#128221; Long Answer Outline</h4><p>${formatContent(note.long_answer_outline)}</p></div>`;
    }

    contentHtml += `<div class="note-section"><h4>&#128214; Full Notes</h4><div class="note-content">${formatContent(note.content)}</div></div>`;

    if (note.related_topics) {
      const related = typeof note.related_topics === 'string' ? JSON.parse(note.related_topics) : note.related_topics;
      if (related && related.length) {
        contentHtml += `<div class="note-section"><h4>&#128279; Related Topics</h4><p>${related.map(r => `<span class="tag">${typeof r === 'string' ? r : r.title}</span>`).join(' ')}</p></div>`;
      }
    }

    document.getElementById('noteModalContent').innerHTML = contentHtml;
    document.getElementById('noteModal').classList.add('active');
  } catch (err) {
    showToast('Failed to load note', 'error');
  }
}

function closeNoteModal() {
  document.getElementById('noteModal').classList.remove('active');
  currentNoteId = null;
}

async function bookmarkCurrentNote() {
  if (!currentNoteId) return;
  try {
    await api(`/api/notes/${currentNoteId}/bookmark`, { method: 'PATCH' });
    showToast('Bookmark toggled', 'success');
  } catch (err) {
    showToast('Failed to bookmark', 'error');
  }
}

function formatContent(content) {
  if (!content) return '';
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/\|(.*)\|/g, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      return '<table><tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr></table>';
    });
}

function loadAITutor(el) {
  el.innerHTML = `
    <h1 class="page-title">&#9878; AI Legal Tutor</h1>
    <p class="page-description">Ask legal questions and get source-aware answers with case law citations and PYQs.</p>

    <div class="card chat-container">
      <div class="chat-messages" id="chatMessages">
        <div class="chat-message assistant">
          <div class="chat-avatar">&#9878;</div>
          <div class="chat-bubble">
            Welcome to LexPrep AI Legal Tutor! I can help you with:
            <ul style="margin:8px 0 0 16px;">
              <li>Answering legal questions with case law citations</li>
              <li>Explaining Constitutional Law, CPC, Evidence, IPC/BNS</li>
              <li>Generating study notes and summaries</li>
              <li>Creating UP PCS-J mock test questions</li>
              <li>"Be the Judge" case analysis</li>
            </ul>
            <p style="margin-top:8px;">What legal topic would you like to study today?</p>
          </div>
        </div>
      </div>
      <div class="chat-input-area">
        <input type="text" id="chatInput" placeholder="Ask a legal question..." style="flex:1;" onkeypress="if(event.key==='Enter')sendChat()">
        <button class="btn btn-primary" onclick="sendChat()">Send</button>
      </div>
    </div>
  `;
}

async function sendChat() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  const messagesEl = document.getElementById('chatMessages');
  messagesEl.innerHTML += `
    <div class="chat-message user">
      <div class="chat-avatar">U</div>
      <div class="chat-bubble">${escapeHtml(message)}</div>
    </div>
  `;
  input.value = '';
  messagesEl.scrollTop = messagesEl.scrollHeight;

  messagesEl.innerHTML += `
    <div class="chat-message assistant" id="pendingResponse">
      <div class="chat-avatar">&#9878;</div>
      <div class="chat-bubble">Analyzing legal database...</div>
    </div>
  `;
  messagesEl.scrollTop = messagesEl.scrollHeight;

  try {
    const res = await api('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    });

    const data = res.data;
    const pending = document.getElementById('pendingResponse');
    if (pending) pending.remove();

    let citationsHtml = '';
    if (data.citations?.length) {
      citationsHtml = `<div class="citation"><strong>&#128218; Sources:</strong><br>${data.citations.map(c => `${c.source} - ${c.chapter}`).join('<br>')}</div>`;
    }

    const confidenceClass = data.confidence > 0.8 ? 'confidence-high' : data.confidence > 0.5 ? 'confidence-medium' : 'confidence-low';

    messagesEl.innerHTML += `
      <div class="chat-message assistant">
        <div class="chat-avatar">&#9878;</div>
        <div class="chat-bubble">
          <div class="note-content">${formatContent(data.answer)}</div>
          ${citationsHtml}
          <span class="confidence ${confidenceClass}">Confidence: ${(data.confidence * 100).toFixed(0)}%</span>
          ${data.follow_up_questions?.length ? `
            <div style="margin-top:8px;">
              <strong style="font-size:12px;">Follow-up:</strong>
              ${data.follow_up_questions.map(q => `<button class="btn btn-sm btn-outline" style="margin:4px;font-size:11px;" onclick="document.getElementById('chatInput').value='${escapeHtml(q)}';sendChat()">${q}</button>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `;
    messagesEl.scrollTop = messagesEl.scrollHeight;
  } catch (err) {
    const pending = document.getElementById('pendingResponse');
    if (pending) pending.remove();
    messagesEl.innerHTML += `
      <div class="chat-message assistant">
        <div class="chat-avatar">&#9878;</div>
        <div class="chat-bubble" style="color:var(--danger);">Error: ${err.message}</div>
      </div>
    `;
  }
}

async function loadExams(el) {
  try {
    const res = await api('/api/exam/list');

    el.innerHTML = `
      <h1 class="page-title">&#9876; Mock Exams & PYQs</h1>
      <p class="page-description">Take timed mock tests for UP PCS-J, Judicial Services, and Civil Judge examinations.</p>

      <div class="card" style="margin-bottom:20px;border-top:3px solid var(--accent);">
        <h3 class="card-title">&#9876; Quick Mock Test</h3>
        <div class="card-body">
          <div class="grid grid-3">
            <div class="form-group">
              <label>Subject</label>
              <select id="mockSubject">
                <option value="Constitutional Law">Constitutional Law</option>
                <option value="Civil Procedure">Civil Procedure</option>
                <option value="Evidence Law">Evidence Law</option>
                <option value="Criminal Law">Criminal Law</option>
                <option value="Contract Law">Contract Law</option>
                <option value="Jurisprudence">Jurisprudence</option>
                <option value="Law of Torts">Law of Torts</option>
                <option value="Transfer of Property">Transfer of Property</option>
                <option value="Limitation & Court Fees">Limitation & Court Fees</option>
                <option value="U.P. Local Laws">U.P. Local Laws</option>
              </select>
            </div>
            <div class="form-group">
              <label>Exam Type</label>
              <select id="mockExamType">
                <option value="UP PCS-J">UP PCS-J</option>
                <option value="Judicial Services">Judicial Services</option>
                <option value="Civil Judge">Civil Judge</option>
                <option value="Bar Exam">Bar Exam</option>
              </select>
            </div>
            <div class="form-group">
              <label>Duration (min)</label>
              <select id="mockDuration">
                <option value="15">15 min</option>
                <option value="30" selected>30 min</option>
                <option value="60">60 min</option>
              </select>
            </div>
          </div>
          <button class="btn btn-primary" onclick="generateMockTest()">Generate Test</button>
        </div>
      </div>

      <h2 class="section-title">&#128203; Available Tests</h2>
      <div class="grid grid-3" id="testsGrid">
        ${res.data.map(t => `
          <div class="card" style="border-top:3px solid var(--accent);">
            <div class="card-header">
              <span class="badge badge-primary">${t.exam_type}</span>
              <span class="badge badge-warning">${t.duration_minutes} min</span>
            </div>
            <div class="card-title">${t.title}</div>
            <div class="card-subtitle">${t.subject}</div>
            <div class="card-body">
              <p style="font-size:13px;">${t.description || ''}</p>
              <div style="margin-top:8px;font-size:12px;color:var(--text-muted);">
                Total Marks: ${t.total_marks} | Passing: ${t.passing_marks}
              </div>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-sm btn-block" onclick="startExam('${t.id}')">Start Test</button>
            </div>
          </div>
        `).join('')}
      </div>

      <div id="examArea" style="margin-top:20px;"></div>
    `;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><p>Failed to load exams.</p></div>`;
  }
}

async function generateMockTest() {
  const subject = document.getElementById('mockSubject').value;
  const examType = document.getElementById('mockExamType').value;
  const duration = document.getElementById('mockDuration').value;

  try {
    const res = await api('/api/ai/mocktest', {
      method: 'POST',
      body: JSON.stringify({ subject, exam_type: examType, duration_minutes: parseInt(duration) })
    });

    const test = res.data;
    runExam(test);
  } catch (err) {
    showToast('Failed to generate test: ' + err.message, 'error');
  }
}

async function startExam(testId) {
  try {
    const res = await api('/api/exam/start', {
      method: 'POST',
      body: JSON.stringify({ test_id: testId })
    });
    runExam(res.data);
  } catch (err) {
    showToast('Failed to start exam', 'error');
  }
}

function runExam(test) {
  const area = document.getElementById('examArea');
  if (!area) return;

  let timeLeft = test.duration_minutes * 60;
  const answers = {};

  area.innerHTML = `
    <div class="card">
      <div class="exam-timer" id="examTimer">${formatTime(timeLeft)}</div>
      <h2 class="card-title">${test.title}</h2>
      <p class="card-subtitle">Total Marks: ${test.total_marks} | Questions: ${test.questions.length}</p>

      <div id="examQuestions">
        ${test.questions.map((q, i) => `
          <div class="question-card card" id="question-${q.id}">
            <div class="card-header">
              <span class="badge badge-${q.type === 'mcq' ? 'primary' : 'warning'}">Q${i + 1} - ${q.type.toUpperCase()}</span>
              <span class="badge badge-${q.difficulty === 'easy' ? 'success' : q.difficulty === 'hard' ? 'danger' : 'warning'}">${q.marks} marks</span>
            </div>
            <div class="question-text">${q.question}</div>
            ${q.options ? `
              <ul class="options-list">
                ${q.options.map((opt, j) => `
                  <li class="option-item" onclick="selectOption('${q.id}', '${escapeHtml(opt)}', this)">${String.fromCharCode(65 + j)}. ${opt}</li>
                `).join('')}
              </ul>
            ` : `
              <div class="form-group" style="margin-top:12px;">
                <textarea id="answer-${q.id}" rows="4" placeholder="Write your answer..." style="width:100%;padding:10px;border:1px solid var(--border);border-radius:var(--radius);resize:vertical;"></textarea>
              </div>
            `}
          </div>
        `).join('')}
      </div>

      <button class="btn btn-danger btn-block" onclick="submitExam('${test.test_id}')" style="margin-top:20px;">Submit Exam</button>
    </div>
  `;

  examTimer = setInterval(() => {
    timeLeft--;
    const timerEl = document.getElementById('examTimer');
    if (timerEl) timerEl.textContent = formatTime(timeLeft);
    if (timeLeft <= 0) {
      clearInterval(examTimer);
      submitExam(test.test_id);
    }
  }, 1000);

  window._examAnswers = answers;
  window._examTest = test;
}

function selectOption(questionId, answer, el) {
  const card = el.closest('.question-card');
  card.querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  window._examAnswers[questionId] = answer;
}

async function submitExam(testId) {
  if (examTimer) clearInterval(examTimer);

  const answers = Object.entries(window._examAnswers || {}).map(([question_id, answer]) => ({ question_id, answer }));

  try {
    const res = await api('/api/exam/submit', {
      method: 'POST',
      body: JSON.stringify({ test_id: testId, answers, time_taken_minutes: window._examTest?.duration_minutes || 30 })
    });

    const result = res.data;
    const area = document.getElementById('examArea');

    area.innerHTML = `
      <div class="card" style="text-align:center;border-top:3px solid var(--accent);">
        <h2 class="card-title">&#9876; Exam Results</h2>
        <div style="font-size:48px;font-weight:700;color:${result.passed ? 'var(--success)' : 'var(--danger)'};margin:16px 0;">
          ${result.percentage.toFixed(1)}%
        </div>
        <p>Score: ${result.score} / ${result.total_marks}</p>
        <p class="badge ${result.passed ? 'badge-success' : 'badge-danger'}" style="font-size:16px;padding:8px 20px;">
          ${result.passed ? 'PASSED' : 'FAILED'}
        </p>

        <div style="margin-top:24px;text-align:left;">
          <h3 class="section-title">Question Analysis</h3>
          ${result.question_results.map((r, i) => `
            <div class="card" style="margin-bottom:12px;border-left:4px solid ${r.is_correct ? 'var(--success)' : 'var(--danger)'};">
              <div class="card-header">
                <span>Q${i + 1}</span>
                <span class="badge ${r.is_correct ? 'badge-success' : 'badge-danger'}">${r.is_correct ? 'Correct' : 'Incorrect'}</span>
              </div>
              ${r.explanation ? `<div class="note-content" style="font-size:13px;margin-top:8px;">${formatContent(r.explanation)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (err) {
    showToast('Failed to submit exam', 'error');
  }
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

async function loadFlashcards(el) {
  try {
    const res = await api('/api/flashcards');
    flashcards = res.data;
    flashcardIndex = 0;

    el.innerHTML = `
      <h1 class="page-title">&#128214; Legal Flashcards</h1>
      <p class="page-description">Spaced repetition learning for case law, sections, and legal principles. Click card to flip.</p>

      <div class="card" style="max-width:600px;margin:0 auto;border-top:3px solid var(--accent);">
        <div class="flashcard-container">
          <div class="flashcard" id="flashcard" onclick="flipCard()">
            <div class="flashcard-front" id="flashcardFront">
              <p>Loading...</p>
            </div>
            <div class="flashcard-back" id="flashcardBack">
              <p>Loading...</p>
            </div>
          </div>
        </div>

        <div style="text-align:center;margin-top:16px;">
          <span id="flashcardCounter">1 / ${flashcards.length}</span>
        </div>

        <div class="flashcard-controls">
          <button class="btn btn-danger" onclick="rateCard(1)">Hard (1)</button>
          <button class="btn btn-outline" onclick="rateCard(3)">Good (3)</button>
          <button class="btn btn-success" onclick="rateCard(5)">Easy (5)</button>
          <button class="btn btn-outline" onclick="nextCard()">Next &rarr;</button>
        </div>
      </div>
    `;

    showFlashcard();
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><p>Failed to load flashcards.</p></div>`;
  }
}

function showFlashcard() {
  if (!flashcards.length) return;
  const card = flashcards[flashcardIndex];
  document.getElementById('flashcardFront').innerHTML = `<p>${card.front}</p>`;
  document.getElementById('flashcardBack').innerHTML = `<p>${card.back}</p>`;
  document.getElementById('flashcardCounter').textContent = `${flashcardIndex + 1} / ${flashcards.length}`;
  document.getElementById('flashcard').classList.remove('flipped');
}

function flipCard() {
  document.getElementById('flashcard').classList.toggle('flipped');
}

function nextCard() {
  flashcardIndex = (flashcardIndex + 1) % flashcards.length;
  showFlashcard();
}

async function rateCard(quality) {
  const card = flashcards[flashcardIndex];
  try {
    await api(`/api/flashcards/${card.id}/progress`, {
      method: 'POST',
      body: JSON.stringify({ quality })
    });
    showToast(`Rated: ${quality >= 4 ? 'Easy' : quality >= 3 ? 'Good' : 'Hard'}`, 'success');
    nextCard();
  } catch (err) {
    nextCard();
  }
}

async function loadAnalytics(el) {
  try {
    const [books, topics, notes, questions] = await Promise.all([
      api('/api/books').catch(() => ({ data: [] })),
      api('/api/topics').catch(() => ({ data: [] })),
      api('/api/notes').catch(() => ({ data: [] })),
      api('/api/questions').catch(() => ({ data: [] }))
    ]);

    const subjects = [...new Set(books.data.map(b => b.subject))];
    const questionTypes = questions.data.reduce((acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1;
      return acc;
    }, {});

    el.innerHTML = `
      <h1 class="page-title">&#128202; Study Analytics</h1>
      <p class="page-description">Track your UP PCS-J preparation progress and identify weak areas.</p>

      <div class="grid grid-4" style="margin-bottom:24px;">
        <div class="card stat-card">
          <div class="stat-value">${books.data.length}</div>
          <div class="stat-label">Master Books</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">${topics.data.length}</div>
          <div class="stat-label">Topics</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">${questions.data.length}</div>
          <div class="stat-label">Questions</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">${notes.data.filter(n => n.is_bookmarked).length}</div>
          <div class="stat-label">Bookmarked Notes</div>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="card">
          <h3 class="card-title">Questions by Type</h3>
          <div class="card-body">
            ${Object.entries(questionTypes).map(([type, count]) => `
              <div style="margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;font-size:14px;">
                  <span style="text-transform:capitalize;">${type}</span>
                  <span>${count}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${(count / questions.data.length) * 100}%"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="card">
          <h3 class="card-title">Content by Subject</h3>
          <div class="card-body">
            ${subjects.map(s => {
              const topicCount = topics.data.filter(t => t.subject === s).length;
              const noteCount = notes.data.filter(n => n.subject === s).length;
              return `
                <div style="margin-bottom:12px;">
                  <div style="font-weight:500;" class="subject-tag">${s}</div>
                  <div style="font-size:12px;color:var(--text-secondary);">${topicCount} topics, ${noteCount} notes</div>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${Math.min(100, (topicCount / 5) * 100)}%"></div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <div class="card" style="margin-top:20px;">
        <h3 class="card-title">&#128161; UP PCS-J Study Recommendations</h3>
        <div class="card-body">
          <ul style="list-style:none;">
            ${subjects.filter(s => topics.data.filter(t => t.subject === s).length < 3).map(s => `
              <li style="padding:8px 0;border-bottom:1px solid var(--border);">
                <span class="badge badge-warning">Low Content</span>
                <strong>${s}</strong> - Add more topics and notes
              </li>
            `).join('')}
            <li style="padding:8px 0;">
              <span class="badge badge-success">Tip</span>
              Practice flashcards daily for better retention of case law and sections
            </li>
            <li style="padding:8px 0;">
              <span class="badge badge-gold">Focus</span>
              Prioritize Constitutional Law, CPC, Evidence, and Criminal Law for UP PCS-J
            </li>
          </ul>
        </div>
      </div>
    `;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><p>Failed to load analytics.</p></div>`;
  }
}

async function loadBookmarks(el) {
  try {
    const res = await api('/api/notes?search=');
    const bookmarked = res.data.filter(n => n.is_bookmarked);

    el.innerHTML = `
      <h1 class="page-title">&#128278; Bookmarks</h1>
      <p class="page-description">Your saved legal notes and resources.</p>

      ${bookmarked.length ? `
        <div class="grid grid-3">
          ${bookmarked.map(n => `
            <div class="card card-clickable" onclick="openNote('${n.id}')" style="border-left:3px solid var(--accent);">
              <div class="card-header">
                <span class="badge badge-primary">${n.subject}</span>
                <span class="badge badge-success">&#128278;</span>
              </div>
              <div class="card-title">${n.title}</div>
              <div class="card-subtitle">${n.topic_title || ''}</div>
            </div>
          `).join('')}
        </div>
      ` : `
        <div class="empty-state">
          <div class="empty-state-icon">&#128278;</div>
          <p>No bookmarks yet. Bookmark notes while studying!</p>
        </div>
      `}
    `;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><p>Sign in to view bookmarks.</p></div>`;
  }
}

async function loadKnowledgeBase(el) {
  try {
    const [doctrines, cases, sections] = await Promise.all([
      api('/api/knowledge/doctrines?limit=20').catch(() => ({ data: [] })),
      api('/api/knowledge/cases?limit=20').catch(() => ({ data: [] })),
      api('/api/knowledge/sections?limit=20').catch(() => ({ data: [] }))
    ]);

    el.innerHTML = `
      <h1 class="page-title">&#128218; Legal Knowledge Base</h1>
      <p class="page-description">Browse doctrines, landmark cases, and statutory provisions organized by subject.</p>

      <div class="filter-bar">
        <select id="kbTypeFilter" onchange="filterKnowledgeBase()">
          <option value="all">All Types</option>
          <option value="doctrines">Doctrines</option>
          <option value="cases">Landmark Cases</option>
          <option value="sections">Statutory Sections</option>
        </select>
        <input type="text" id="kbSearchFilter" placeholder="Search knowledge base..." oninput="filterKnowledgeBase()">
      </div>

      <div class="grid grid-2" id="kbGrid">
        ${doctrines.data.map(d => `
          <div class="card kb-card" data-type="doctrines" onclick="openDoctrine('${d.id}')">
            <div class="card-header">
              <span class="badge badge-gold">Doctrine</span>
              <span class="badge badge-primary">${d.subject}</span>
            </div>
            <div class="card-title">${d.name}</div>
            <div class="card-subtitle">${d.origin_case || ''}</div>
            <p style="font-size:13px;color:var(--text-secondary);margin-top:8px;">${(d.description || '').substring(0, 120)}...</p>
          </div>
        `).join('')}

        ${cases.data.map(c => `
          <div class="card kb-card" data-type="cases" onclick="openCase('${c.id}')">
            <div class="card-header">
              <span class="badge badge-danger">Case</span>
              <span class="badge badge-primary">${c.subject}</span>
            </div>
            <div class="card-title">${c.case_name}</div>
            <div class="card-subtitle">${c.citation} | ${c.year || 'N/A'}</div>
            <p style="font-size:13px;color:var(--text-secondary);margin-top:8px;">${(c.ratio || c.significance || '').substring(0, 120)}...</p>
          </div>
        `).join('')}

        ${sections.data.map(s => `
          <div class="card kb-card" data-type="sections" onclick="openSection('${s.id}')">
            <div class="card-header">
              <span class="badge badge-success">Section</span>
              <span class="badge badge-primary">${s.subject}</span>
            </div>
            <div class="card-title">Section ${s.section_number} - ${s.act_name}</div>
            <div class="card-subtitle">${s.title || ''}</div>
            <p style="font-size:13px;color:var(--text-secondary);margin-top:8px;">${(s.text || s.explanation || '').substring(0, 120)}...</p>
          </div>
        `).join('')}
      </div>
    `;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><p>Failed to load knowledge base.</p></div>`;
  }
}

function filterKnowledgeBase() {
  const type = document.getElementById('kbTypeFilter')?.value || 'all';
  const search = document.getElementById('kbSearchFilter')?.value.toLowerCase() || '';

  document.querySelectorAll('.kb-card').forEach(card => {
    const matchType = type === 'all' || card.dataset.type === type;
    const matchSearch = !search || card.textContent.toLowerCase().includes(search);
    card.style.display = (matchType && matchSearch) ? '' : 'none';
  });
}

async function openDoctrine(id) {
  try {
    const res = await api(`/api/knowledge/doctrines/${id}`);
    const d = res.data;
    showToast(`Doctrine: ${d.name}`, 'info');
  } catch (err) {
    showToast('Failed to load doctrine', 'error');
  }
}

async function openCase(id) {
  try {
    const res = await api(`/api/knowledge/cases/${id}`);
    const c = res.data;
    showToast(`Case: ${c.case_name}`, 'info');
  } catch (err) {
    showToast('Failed to load case', 'error');
  }
}

async function openSection(id) {
  try {
    const res = await api(`/api/knowledge/sections/${id}`);
    const s = res.data;
    showToast(`Section ${s.section_number}, ${s.act_name}`, 'info');
  } catch (err) {
    showToast('Failed to load section', 'error');
  }
}

async function loadAdmin(el) {
  if (!currentUser || currentUser.role !== 'admin') {
    el.innerHTML = `<div class="empty-state"><p>Admin access required.</p></div>`;
    return;
  }

  try {
    const res = await api('/api/admin/stats');
    const stats = res.data;

    el.innerHTML = `
      <h1 class="page-title">&#9881; Admin Dashboard</h1>
      <p class="page-description">Manage content, view statistics, and configure the LexPrep AI platform.</p>

      <div class="grid grid-4" style="margin-bottom:24px;">
        <div class="card stat-card">
          <div class="stat-value">${stats.books.total}</div>
          <div class="stat-label">Books</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">${stats.topics.total}</div>
          <div class="stat-label">Topics</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">${stats.notes.total}</div>
          <div class="stat-label">Notes</div>
        </div>
        <div class="card stat-card">
          <div class="stat-value">${stats.questions.total}</div>
          <div class="stat-label">Questions</div>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="card">
          <h3 class="card-title">Add Content</h3>
          <div class="card-body">
            <div class="form-group">
              <label>Content Type</label>
              <select id="adminContentType">
                <option value="book">Book</option>
                <option value="topic">Topic</option>
                <option value="note">Note</option>
                <option value="question">Question</option>
                <option value="flashcard">Flashcard</option>
              </select>
            </div>
            <div class="form-group">
              <label>JSON Data</label>
              <textarea id="adminContentData" rows="8" placeholder='{"title": "...", "subject": "..."}' style="font-family:monospace;font-size:12px;"></textarea>
            </div>
            <button class="btn btn-primary" onclick="addAdminContent()">Add Content</button>
          </div>
        </div>

        <div class="card">
          <h3 class="card-title">Recent Activity</h3>
          <div class="card-body">
            <p>Tests taken (7 days): ${stats.recent_activity.recent_tests}</p>
            <p>Searches (7 days): ${stats.recent_activity.recent_searches}</p>
            <p>AI Chats (7 days): ${stats.recent_activity.recent_chats}</p>
            <p>Users: ${stats.users.total}</p>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><p>Failed to load admin stats.</p></div>`;
  }
}

async function addAdminContent() {
  const type = document.getElementById('adminContentType').value;
  let data;
  try {
    data = JSON.parse(document.getElementById('adminContentData').value);
  } catch {
    showToast('Invalid JSON', 'error');
    return;
  }

  try {
    await api('/api/admin/content', {
      method: 'POST',
      body: JSON.stringify({ type, data })
    });
    showToast('Content added successfully', 'success');
    document.getElementById('adminContentData').value = '';
  } catch (err) {
    showToast('Failed to add content', 'error');
  }
}

function toggleAuthModal() {
  document.getElementById('authModal').classList.toggle('active');
}

function switchAuthMode() {
  authMode = authMode === 'login' ? 'register' : 'login';
  document.getElementById('authModalTitle').textContent = authMode === 'login' ? 'Sign In' : 'Sign Up';
  document.getElementById('authSubmitBtn').textContent = authMode === 'login' ? 'Sign In' : 'Sign Up';
  document.getElementById('nameGroup').style.display = authMode === 'register' ? 'block' : 'none';
  document.getElementById('authSwitch').innerHTML = authMode === 'login'
    ? 'Don\'t have an account? <a href="#" onclick="switchAuthMode()">Sign Up</a>'
    : 'Already have an account? <a href="#" onclick="switchAuthMode()">Sign In</a>';
}

async function handleAuth(e) {
  e.preventDefault();
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  const name = document.getElementById('authName').value;

  try {
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const body = authMode === 'login' ? { email, password } : { email, password, name };

    const res = await api(endpoint, { method: 'POST', body: JSON.stringify(body) });
    token = res.data.token;
    currentUser = res.data.user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(currentUser));

    toggleAuthModal();
    updateAuthUI();
    showToast(`Welcome, ${currentUser.name}!`, 'success');
    navigateTo('dashboard');
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function logout() {
  token = null;
  currentUser = null;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  updateAuthUI();
  showToast('Signed out', 'info');
  navigateTo('dashboard');
}

function updateAuthUI() {
  const authBtn = document.getElementById('authBtn');
  const userName = document.getElementById('userName');
  const userRole = document.getElementById('userRole');
  const userAvatar = document.getElementById('userAvatar');
  const adminNav = document.getElementById('adminNavItem');

  if (currentUser) {
    authBtn.textContent = 'Sign Out';
    authBtn.onclick = logout;
    userName.textContent = currentUser.name;
    userRole.textContent = currentUser.role === 'admin' ? 'Administrator' : 'UP PCS-J Aspirant';
    userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
    adminNav.style.display = currentUser.role === 'admin' ? 'flex' : 'none';
  } else {
    authBtn.textContent = 'Sign In';
    authBtn.onclick = toggleAuthModal;
    userName.textContent = 'Guest';
    userRole.textContent = 'UP PCS-J Preparation Portal';
    userAvatar.textContent = 'G';
    adminNav.style.display = 'none';
  }
}

async function performSearch(query) {
  if (!query || query.length < 2) {
    document.getElementById('searchResults').classList.remove('active');
    return;
  }

  try {
    const res = await api(`/api/knowledge/search?q=${encodeURIComponent(query)}&limit=5`).catch(() => ({ data: null }));

    const resultsEl = document.getElementById('searchResults');

    if (!res?.data || res.data.total === 0) {
      resultsEl.innerHTML = '<div class="search-result-item"><span class="search-result-title">No results found</span></div>';
    } else {
      const d = res.data;
      let html = '';

      if (d.sections?.length) {
        html += `<div class="search-result-header">Sections</div>`;
        d.sections.slice(0, 3).forEach(r => {
          html += `<div class="search-result-item" onclick="openSection('${r.id}')">
            <span class="search-result-type">Section</span>
            <div class="search-result-title">${r.section_number} - ${r.act_name}</div>
            <div class="search-result-subject">${r.title || r.subject}</div>
          </div>`;
        });
      }

      if (d.cases?.length) {
        html += `<div class="search-result-header">Cases</div>`;
        d.cases.slice(0, 3).forEach(r => {
          html += `<div class="search-result-item" onclick="openCase('${r.id}')">
            <span class="search-result-type">Case</span>
            <div class="search-result-title">${r.case_name}</div>
            <div class="search-result-subject">${r.citation}</div>
          </div>`;
        });
      }

      if (d.topics?.length) {
        html += `<div class="search-result-header">Topics</div>`;
        d.topics.slice(0, 3).forEach(r => {
          html += `<div class="search-result-item" onclick="openTopic('${r.id}')">
            <span class="search-result-type">Topic</span>
            <div class="search-result-title">${r.title}</div>
            <div class="search-result-subject">${r.subject}</div>
          </div>`;
        });
      }

      if (d.notes?.length) {
        html += `<div class="search-result-header">Notes</div>`;
        d.notes.slice(0, 3).forEach(r => {
          html += `<div class="search-result-item" onclick="openNote('${r.id}')">
            <span class="search-result-type">Note</span>
            <div class="search-result-title">${r.title}</div>
            <div class="search-result-subject">${r.subject}</div>
          </div>`;
        });
      }

      if (d.doctrines?.length) {
        html += `<div class="search-result-header">Doctrines</div>`;
        d.doctrines.slice(0, 2).forEach(r => {
          html += `<div class="search-result-item">
            <span class="search-result-type">Doctrine</span>
            <div class="search-result-title">${r.name}</div>
            <div class="search-result-subject">${r.subject}</div>
          </div>`;
        });
      }

      resultsEl.innerHTML = html;
    }

    resultsEl.classList.add('active');
  } catch (err) {
    console.error('Search error:', err);
  }
}

function openSearchResult(type, id) {
  document.getElementById('searchResults').classList.remove('active');
  document.getElementById('globalSearch').value = '';

  switch (type) {
    case 'book': navigateTo('books'); setTimeout(() => openBook(id), 200); break;
    case 'topic': navigateTo('topics'); setTimeout(() => openTopic(id), 200); break;
    case 'note': navigateTo('notes'); setTimeout(() => openNote(id), 200); break;
    case 'section': openSection(id); break;
    case 'case': openCase(id); break;
    case 'doctrine': openDoctrine(id); break;
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  localStorage.setItem('theme', current === 'dark' ? 'light' : 'dark');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

  updateAuthUI();
  navigateTo('dashboard');

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(item.dataset.page);
    });
  });

  document.getElementById('sidebarToggle').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  let searchTimeout;
  document.getElementById('globalSearch').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => performSearch(e.target.value), 300);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      document.getElementById('searchResults').classList.remove('active');
    }
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  });
});
