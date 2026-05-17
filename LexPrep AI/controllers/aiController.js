const { getDb } = require('../models/database');
const { v4: uuidv4 } = require('uuid');

const MOCK_RESPONSES = {
  default: {
    answer: "Based on the indexed legal database, here is the analysis of your query.\n\n**Key Points:**\n\n1. The relevant legal provisions are found in the indexed sources.\n2. The principle established requires examination of the facts in light of statutory provisions.\n3. Leading cases support this interpretation.\n\n**Application:**\nApply the legal principles to the specific facts of your question. Consider both the statutory framework and judicial interpretations.\n\n**Conclusion:**\nThe answer depends on the specific facts and applicable provisions. Review the cited sources for detailed analysis.",
    citations: [
      { source: "Indian Constitutional Law", chapter: "Fundamental Rights", section: "Articles 14-32" },
      { source: "Contract Law Principles", chapter: "Formation of Contract", section: "Sections 1-10" }
    ],
    confidence: 0.85,
    follow_up_questions: [
      "What are the exceptions to this rule?",
      "How does this apply to recent amendments?",
      "What are the leading case laws on this topic?"
    ],
    exam_tags: ["LLB", "Judicial", "APO"]
  },
  contract: {
    answer: "**Contract Law Analysis**\n\n**Issue:** Whether a valid contract exists between the parties.\n\n**Relevant Law:**\n- Section 10, Indian Contract Act 1872: All agreements are contracts if made by free consent, competent parties, lawful consideration, and lawful object.\n- Section 2(h): A contract is an agreement enforceable by law.\n\n**Essential Elements:**\n1. Offer and Acceptance (Sections 2(a)-2(b))\n2. Intention to create legal relations\n3. Lawful consideration (Section 2(d))\n4. Capacity of parties (Section 11)\n5. Free consent (Section 13-22)\n6. Lawful object (Section 23)\n\n**Application:** Examine whether all essential elements are present in the given facts.\n\n**Conclusion:** A contract is valid only if all essential elements under Section 10 are satisfied.",
    citations: [
      { source: "Indian Contract Act 1872", chapter: "Formation", section: "Sections 1-10" },
      { source: "Pollock & Mulla on Contract", chapter: "Essentials of Contract", section: "Section 10 Commentary" }
    ],
    confidence: 0.92,
    follow_up_questions: [
      "What constitutes free consent?",
      "Explain void vs voidable contracts",
      "What are the remedies for breach of contract?"
    ],
    exam_tags: ["LLB", "Judicial", "APO", "Bar Exam"]
  },
  constitutional: {
    answer: "**Constitutional Law Analysis**\n\n**Issue:** Whether the impugned action violates constitutional provisions.\n\n**Relevant Provisions:**\n- Article 14: Right to Equality\n- Article 19: Six Freedoms\n- Article 21: Right to Life and Personal Liberty\n- Article 32: Constitutional Remedies\n\n**Doctrine Applied:**\n1. Doctrine of Basic Structure (Kesavananda Bharati v. State of Kerala, 1973)\n2. Doctrine of Proportionality\n3. Doctrine of Reasonable Classification\n\n**Test for Article 14:**\n- Intelligible differentia\n- Rational nexus with the object\n\n**Test for Article 19 restrictions:**\n- Must be within grounds specified in clauses (2)-(6)\n- Must be reasonable\n- Must satisfy proportionality test (K.S. Puttaswamy v. Union of India, 2017)\n\n**Conclusion:** The constitutional validity depends on satisfying the relevant tests.",
    citations: [
      { source: "Constitution of India", chapter: "Fundamental Rights", section: "Articles 12-35" },
      { source: "M.P. Jain - Indian Constitutional Law", chapter: "Equality", section: "Article 14" },
      { source: "Kesavananda Bharati v. State of Kerala", chapter: "Basic Structure", section: "AIR 1973 SC 1461" }
    ],
    confidence: 0.90,
    follow_up_questions: [
      "Explain the basic structure doctrine",
      "What is the scope of Article 21?",
      "Discuss the evolution of Article 19"
    ],
    exam_tags: ["LLB", "Judicial", "APO", "Bar Exam", "UPSC"]
  },
  criminal: {
    answer: "**Criminal Law Analysis**\n\n**Issue:** Whether the accused is liable for the alleged offence.\n\n**Relevant Law:**\n- Bharatiya Nyaya Sanhita 2023 (replacing IPC 1860)\n- Key principles: Mens rea, Actus reus, Causation\n\n**General Exceptions (Sections 14-40 BNS):**\n1. Mistake of fact (Section 14)\n2. Accident (Section 15)\n3. Self-defence (Sections 27-32)\n4. Insanity (Section 18)\n5. Intoxication (Sections 19-20)\n\n**Burden of Proof:**\n- Prosecution must prove guilt beyond reasonable doubt\n- Presumption of innocence (Article 21)\n- Standard: Proof beyond reasonable doubt\n\n**Key Offences:**\n- Culpable homicide vs Murder\n- Hurt vs Grievous hurt\n- Criminal conspiracy\n- Abetment\n\n**Conclusion:** Liability depends on establishing both actus reus and mens rea, and absence of general exceptions.",
    citations: [
      { source: "Bharatiya Nyaya Sanhita 2023", chapter: "General Exceptions", section: "Sections 14-40" },
      { source: "Ratanlal & Dhirajlal - Law of Crimes", chapter: "General Principles", section: "Mens Rea" }
    ],
    confidence: 0.88,
    follow_up_questions: [
      "Difference between culpable homicide and murder?",
      "Explain right of private defence",
      "What are the stages of crime?"
    ],
    exam_tags: ["LLB", "Judicial", "APO", "Bar Exam"]
  }
};

function detectTopic(message) {
  const msg = message.toLowerCase();
  if (msg.includes('contract') || msg.includes('agreement') || msg.includes('consideration') || msg.includes('breach')) return 'contract';
  if (msg.includes('constitution') || msg.includes('article') || msg.includes('fundamental right') || msg.includes('equality') || msg.includes('freedom')) return 'constitutional';
  if (msg.includes('crime') || msg.includes('murder') || msg.includes('theft') || msg.includes('punishment') || msg.includes('offence') || msg.includes('ipc') || msg.includes('bns')) return 'criminal';
  return 'default';
}

function buildRetrievalContext(query) {
  const db = getDb();
  const context = {
    notes: [],
    topics: [],
    books: [],
    questions: [],
    doctrines: [],
    landmark_cases: [],
    sections: [],
    total_sources: 0
  };

  const searchTerms = query.split(/\s+/).filter(w => w.length > 2);
  const likePatterns = searchTerms.map(t => `%${t}%`);

  try {
    const noteResults = db.prepare(`
      SELECT id, title, subject, overview, definition_rule, statutory_basis, key_provisions,
             leading_cases, exam_tags, semester, confidence_score, topic_path
      FROM notes
      WHERE title LIKE ? OR overview LIKE ? OR definition_rule LIKE ? OR subject LIKE ?
      LIMIT 8
    `).all(likePatterns[0] || '%', likePatterns[0] || '%', likePatterns[0] || '%', likePatterns[0] || '%');
    context.notes = noteResults.map(n => ({
      id: n.id,
      title: n.title,
      subject: n.subject,
      overview: n.overview,
      definition_rule: n.definition_rule,
      statutory_basis: n.statutory_basis,
      key_provisions: n.key_provisions,
      leading_cases: n.leading_cases,
      exam_tags: n.exam_tags,
      confidence_score: n.confidence_score
    }));
  } catch (e) { context.notes = []; }

  try {
    const topicResults = db.prepare(`
      SELECT id, title, subject, summary, exam_tags, difficulty
      FROM topics
      WHERE title LIKE ? OR summary LIKE ? OR subject LIKE ?
      LIMIT 6
    `).all(likePatterns[0] || '%', likePatterns[0] || '%', likePatterns[0] || '%');
    context.topics = topicResults;
  } catch (e) { context.topics = []; }

  try {
    const doctrineResults = db.prepare(`
      SELECT id, name, description, subject, origin_case, origin_case_citation, application, exam_tags
      FROM doctrines
      WHERE name LIKE ? OR description LIKE ? OR application LIKE ?
      LIMIT 5
    `).all(likePatterns[0] || '%', likePatterns[0] || '%', likePatterns[0] || '%');
    context.doctrines = doctrineResults;
  } catch (e) { context.doctrines = []; }

  try {
    const caseResults = db.prepare(`
      SELECT id, case_name, citation, court, year, subject, ratio, significance, exam_tags
      FROM landmark_cases
      WHERE case_name LIKE ? OR citation LIKE ? OR ratio LIKE ? OR significance LIKE ?
      LIMIT 5
    `).all(likePatterns[0] || '%', likePatterns[0] || '%', likePatterns[0] || '%', likePatterns[0] || '%');
    context.landmark_cases = caseResults;
  } catch (e) { context.landmark_cases = []; }

  try {
    const sectionResults = db.prepare(`
      SELECT id, section_number, act_name, title, text, explanation, subject, exam_tags
      FROM sections
      WHERE section_number LIKE ? OR act_name LIKE ? OR title LIKE ? OR text LIKE ?
      LIMIT 8
    `).all(likePatterns[0] || '%', likePatterns[0] || '%', likePatterns[0] || '%', likePatterns[0] || '%');
    context.sections = sectionResults;
  } catch (e) { context.sections = []; }

  try {
    const questionResults = db.prepare(`
      SELECT id, question, correct_answer, explanation, subject, exam_tags, difficulty
      FROM questions
      WHERE question LIKE ? OR explanation LIKE ?
      LIMIT 4
    `).all(likePatterns[0] || '%', likePatterns[0] || '%');
    context.questions = questionResults;
  } catch (e) { context.questions = []; }

  context.total_sources = context.notes.length + context.topics.length + context.doctrines.length +
    context.landmark_cases.length + context.sections.length + context.questions.length;

  return context;
}

function formatRetrievalContext(context) {
  let formatted = '';

  if (context.sections.length > 0) {
    formatted += '\n=== STATUTORY PROVISIONS ===\n';
    context.sections.forEach(s => {
      formatted += `[Section ${s.section_number}, ${s.act_name}] ${s.title}: ${s.text || ''}\n`;
      if (s.explanation) formatted += `  Explanation: ${s.explanation}\n`;
    });
  }

  if (context.doctrines.length > 0) {
    formatted += '\n=== LEGAL DOCTRINES ===\n';
    context.doctrines.forEach(d => {
      formatted += `[${d.name}] ${d.description || ''}\n`;
      if (d.origin_case) formatted += `  Origin: ${d.origin_case}${d.origin_case_citation ? ` (${d.origin_case_citation})` : ''}\n`;
      if (d.application) formatted += `  Application: ${d.application}\n`;
    });
  }

  if (context.landmark_cases.length > 0) {
    formatted += '\n=== LANDMARK CASES ===\n';
    context.landmark_cases.forEach(c => {
      formatted += `[${c.case_name}] ${c.citation}\n`;
      if (c.ratio) formatted += `  Ratio: ${c.ratio}\n`;
      if (c.significance) formatted += `  Significance: ${c.significance}\n`;
    });
  }

  if (context.notes.length > 0) {
    formatted += '\n=== STUDY NOTES ===\n';
    context.notes.forEach(n => {
      formatted += `[Note: ${n.title}] Subject: ${n.subject}\n`;
      if (n.overview) formatted += `  Overview: ${n.overview}\n`;
      if (n.definition_rule) formatted += `  Rule: ${n.definition_rule}\n`;
      if (n.statutory_basis) formatted += `  Statutory Basis: ${n.statutory_basis}\n`;
    });
  }

  if (context.topics.length > 0) {
    formatted += '\n=== TOPICS ===\n';
    context.topics.forEach(t => {
      formatted += `[Topic: ${t.title}] Subject: ${t.subject}\n`;
      if (t.summary) formatted += `  Summary: ${t.summary}\n`;
    });
  }

  if (context.questions.length > 0) {
    formatted += '\n=== PRACTICE QUESTIONS ===\n';
    context.questions.forEach(q => {
      formatted += `[Q] ${q.question}\n`;
      if (q.correct_answer) formatted += `  Answer: ${q.correct_answer}\n`;
    });
  }

  return formatted || 'No relevant sources found in the indexed database.';
}

function buildSystemPrompt(retrievalContext, mode = 'chat') {
  const contextStr = formatRetrievalContext(retrievalContext);
  const hasSources = retrievalContext.total_sources > 0;

  const modeInstructions = {
    chat: 'Provide a clear, structured answer with citations.',
    'be-the-judge': 'Analyze the case using the IRAC format: Facts, Issues, Rule, Analysis, Conclusion. Act as a judge deciding the matter.',
    'exam-answer': 'Write an exam-ready answer with introduction, body (legal provisions, case law, analysis), and conclusion. Use headings and structured format.',
    'mcq-gen': 'Generate MCQs based on the retrieved content. Each MCQ must have 4 options, correct answer, and explanation with citation.',
    'summary': 'Provide a concise summary of the legal topic with key provisions, leading cases, and exam points.',
    'revision': 'Provide quick revision bullets covering the essential points for last-minute review.'
  };

  return `You are LexPrep AI, an expert Indian legal education assistant. You operate under STRICT retrieval-grounded rules.

## CORE RULES (NON-NEGOTIABLE)
1. ANSWER ONLY FROM THE INDEXED DATABASE CONTEXT PROVIDED BELOW. Do not use external knowledge.
2. NEVER invent, fabricate, or hallucinate legal citations, case names, section numbers, or doctrines.
3. If the retrieved context does not contain sufficient information, explicitly state: "NOT FOUND IN CORPUS: The indexed database does not contain sufficient information on this topic. Please try a different query or consult the study materials."
4. ALWAYS cite sources for every factual claim using the format: [Source: <title>, <detail>]
5. Indicate confidence level (0-1) based on source coverage.
6. If multiple sources conflict, note the conflict and cite both sources.
7. For exam answers, write in a clear, structured, student-friendly format.

## RESPONSE FORMAT
Return a JSON object with these fields:
- answer: string (the main response, markdown-formatted)
- citations: array of {source, chapter, section, citation_text}
- confidence: number (0-1, based on source coverage)
- follow_up_questions: array of strings (3 relevant follow-up questions)
- exam_tags: array of strings (relevant exam tags from sources)
- sources_found: boolean
- source_count: number
- mode: string (the response mode)

## MODE: ${mode}
${modeInstructions[mode] || modeInstructions.chat}

## RETRIEVED DATABASE CONTEXT
${contextStr}

## SOURCE COVERAGE
Total sources found: ${retrievalContext.total_sources}
Notes: ${retrievalContext.notes.length} | Topics: ${retrievalContext.topics.length} | Doctrines: ${retrievalContext.doctrines.length}
Cases: ${retrievalContext.landmark_cases.length} | Sections: ${retrievalContext.sections.length} | Questions: ${retrievalContext.questions.length}

Respond in valid JSON format only.`;
}

async function chatWithAI(req, res) {
  try {
    const { message, mode = 'chat', history = [] } = req.body;
    const userId = req.user?.id || 'anonymous';

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const retrievalContext = buildRetrievalContext(message);
    const topic = detectTopic(message);
    const hasSources = retrievalContext.total_sources > 0;

    if (process.env.AI_MOCK_MODE === 'true' || process.env.AI_MOCK_MODE === true) {
      const mockResponse = MOCK_RESPONSES[topic] || MOCK_RESPONSES.default;

      const citations = [];
      retrievalContext.sections.forEach(s => citations.push({
        source: s.act_name,
        chapter: s.subject,
        section: `Section ${s.section_number}`,
        citation_text: `${s.section_number}, ${s.act_name}`
      }));
      retrievalContext.doctrines.forEach(d => citations.push({
        source: d.name,
        chapter: d.subject,
        section: d.origin_case_citation || 'Doctrine',
        citation_text: d.origin_case || d.name
      }));
      retrievalContext.landmark_cases.forEach(c => citations.push({
        source: c.case_name,
        chapter: c.subject,
        section: c.citation,
        citation_text: `${c.case_name}, ${c.citation}`
      }));
      retrievalContext.notes.forEach(n => citations.push({
        source: n.title,
        chapter: n.subject,
        section: 'Note',
        citation_text: n.title
      }));

      const response = {
        ...mockResponse,
        citations: citations.length > 0 ? citations : mockResponse.citations,
        confidence: hasSources ? 0.90 : 0.30,
        sources_found: hasSources,
        source_count: retrievalContext.total_sources,
        mode: 'mock',
        database_results: {
          notes: retrievalContext.notes.length,
          topics: retrievalContext.topics.length,
          doctrines: retrievalContext.doctrines.length,
          cases: retrievalContext.landmark_cases.length,
          sections: retrievalContext.sections.length,
          questions: retrievalContext.questions.length
        }
      };

      saveChatHistory(userId, message, response);

      return res.json({
        success: true,
        data: response,
        mode: 'mock',
        timestamp: new Date().toISOString()
      });
    }

    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const systemPrompt = buildSystemPrompt(retrievalContext, mode);

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-10).map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: message }
      ],
      temperature: 0.2,
      max_tokens: 2500,
      response_format: { type: 'json_object' }
    });

    let aiResponse;
    try {
      aiResponse = JSON.parse(completion.choices[0].message.content);
    } catch {
      aiResponse = {
        answer: completion.choices[0].message.content,
        citations: retrievalContext.sections.map(s => ({
          source: s.act_name,
          chapter: s.subject,
          section: `Section ${s.section_number}`
        })),
        confidence: hasSources ? 0.85 : 0.30,
        follow_up_questions: ["Can you elaborate on any specific aspect?", "Would you like related case laws?", "Should I generate practice questions on this topic?"],
        exam_tags: ["LLB", "Judicial"],
        sources_found: hasSources,
        source_count: retrievalContext.total_sources,
        mode: mode
      };
    }

    aiResponse.database_results = {
      notes: retrievalContext.notes.length,
      topics: retrievalContext.topics.length,
      doctrines: retrievalContext.doctrines.length,
      cases: retrievalContext.landmark_cases.length,
      sections: retrievalContext.sections.length,
      questions: retrievalContext.questions.length
    };

    saveChatHistory(userId, message, aiResponse);

    res.json({
      success: true,
      data: aiResponse,
      mode: 'openai',
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('AI Chat Error:', err);
    res.status(500).json({
      error: 'AI service unavailable',
      fallback: MOCK_RESPONSES.default,
      message: 'Using fallback response. Please try again later.'
    });
  }
}

async function generateSummary(req, res) {
  try {
    const { topic_id, text, max_length = 200 } = req.body;

    let content = text;
    if (topic_id) {
      const Topic = require('../models/Topic');
      const topic = Topic.findById(topic_id);
      if (!topic) return res.status(404).json({ error: 'Topic not found' });
      content = topic.content || topic.summary;
    }

    if (!content) return res.status(400).json({ error: 'No content to summarize' });

    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const summary = sentences.slice(0, Math.min(5, Math.ceil(max_length / 30))).join('. ').trim() + '.';

    res.json({
      success: true,
      data: {
        original_length: content.length,
        summary,
        summary_length: summary.length,
        key_points: sentences.slice(0, 3).map(s => s.trim()).filter(s => s.length > 10)
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate summary', details: err.message });
  }
}

async function generateMockTest(req, res) {
  try {
    const { subject, exam_type, mcq_count = 20, short_count = 5, long_count = 2, duration_minutes = 60 } = req.body;

    if (!subject) return res.status(400).json({ error: 'Subject is required' });

    const Question = require('../models/Question');
    const Test = require('../models/Test');

    const questions = Question.findAll({ subject, limit: mcq_count + short_count + long_count });

    if (questions.length < 5) {
      return res.status(404).json({
        error: 'Insufficient questions in database',
        available: questions.length,
        suggestion: 'Add more questions for this subject'
      });
    }

    const mcqs = questions.filter(q => q.type === 'mcq').slice(0, mcq_count);
    const shorts = questions.filter(q => q.type === 'short').slice(0, short_count);
    const longs = questions.filter(q => q.type === 'long').slice(0, long_count);

    const testQuestions = [...mcqs, ...shorts, ...longs];
    const totalMarks = mcqs.length * 1 + shorts.length * 5 + longs.length * 10;

    res.json({
      success: true,
      data: {
        title: `${subject} Mock Test`,
        exam_type,
        duration_minutes,
        total_marks: totalMarks,
        passing_marks: Math.floor(totalMarks * 0.4),
        questions: testQuestions.map(q => ({
          id: q.id,
          type: q.type,
          question: q.question,
          options: q.options ? JSON.parse(q.options) : null,
          marks: q.marks,
          difficulty: q.difficulty
        }))
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate mock test', details: err.message });
  }
}

function saveChatHistory(userId, message, response) {
  try {
    const db = getDb();
    const id = uuidv4();
    const messages = JSON.stringify([{ role: 'user', content: message }, { role: 'assistant', content: response.answer }]);
    db.prepare('INSERT INTO ai_chat_history (id, user_id, messages) VALUES (?, ?, ?)').run(id, userId, messages);
    db.save();
  } catch (e) {
    console.error('Failed to save chat history:', e.message);
  }
}

module.exports = { chatWithAI, generateSummary, generateMockTest, buildRetrievalContext, formatRetrievalContext, buildSystemPrompt, detectTopic };
