const { initDatabase, getDb } = require('../models/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const path = require('path');

async function seed() {
  try {
    await initDatabase();
    const db = getDb();

    console.log('Seeding database...');

    const books = require('../data/books.json');
    const topics = require('../data/topics.json');
    const notes = require('../data/notes.json');
    const questions = require('../data/questions.json');
    const flashcards = require('../data/flashcards.json');

    db.prepare('DELETE FROM user_flashcard_progress').run();
    db.prepare('DELETE FROM flashcards').run();
    db.prepare('DELETE FROM test_results').run();
    db.prepare('DELETE FROM tests').run();
    db.prepare('DELETE FROM questions').run();
    db.prepare('DELETE FROM notes').run();
    db.prepare('DELETE FROM topics').run();
    db.prepare('DELETE FROM books').run();
    db.prepare('DELETE FROM users').run();
    db.prepare('DELETE FROM doctrines').run();
    db.prepare('DELETE FROM landmark_cases').run();
    db.prepare('DELETE FROM sections').run();
    db.prepare('DELETE FROM topic_graph').run();
    db.prepare('DELETE FROM document_chunks').run();
    db.prepare('DELETE FROM cached_summaries').run();

    const adminId = uuidv4();
    const adminPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);
    db.prepare('INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)').run(
      adminId, process.env.ADMIN_EMAIL || 'admin@lexprep.ai', adminPassword, 'Admin', 'admin'
    );

    const studentId = uuidv4();
    const studentPassword = bcrypt.hashSync('student123', 10);
    db.prepare('INSERT INTO users (id, email, password, name, role, exam_focus, semester) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
      studentId, 'student@lexprep.ai', studentPassword, 'Demo Student', 'student', 'UP PCS-J', 3
    );

    console.log('Users seeded');

    books.forEach(book => {
      db.prepare(`
        INSERT INTO books (id, title, author, subject, description, exam_tags, semester, year, total_chapters, is_open_access, cover_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(book.id, book.title, book.author, book.subject, book.description, book.exam_tags, book.semester, book.year, book.total_chapters, book.is_open_access, book.cover_url);
    });
    console.log(`Seeded ${books.length} books`);

    topics.forEach(topic => {
      db.prepare(`
        INSERT INTO topics (id, book_id, parent_topic_id, title, subject, content, summary, exam_tags, semester, difficulty, order_index, topic_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(topic.id, topic.book_id, topic.parent_topic_id || null, topic.title, topic.subject, topic.content, topic.summary, topic.exam_tags, topic.semester, topic.difficulty, topic.order_index, topic.topic_path || null);
    });
    console.log(`Seeded ${topics.length} topics`);

    notes.forEach(note => {
      db.prepare(`
        INSERT INTO notes (id, topic_id, title, content, subject, exam_tags, semester, tags, is_bookmarked,
          overview, why_it_matters, definition_rule, statutory_basis, key_provisions,
          leading_cases, irac_analysis, exam_explanation, quick_revision_bullets,
          deep_revision_summary, mcqs, long_answer_outline, related_topics, citations,
          confidence_score, topic_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(note.id, note.topic_id, note.title, note.content, note.subject, note.exam_tags, note.semester, note.tags, note.is_bookmarked,
        note.overview || null, note.why_it_matters || null, note.definition_rule || null, note.statutory_basis || null, note.key_provisions || null,
        note.leading_cases ? JSON.stringify(note.leading_cases) : null, note.irac_analysis || null, note.exam_explanation || null,
        note.quick_revision_bullets ? JSON.stringify(note.quick_revision_bullets) : null,
        note.deep_revision_summary || null, note.mcqs ? JSON.stringify(note.mcqs) : null, note.long_answer_outline || null,
        note.related_topics ? JSON.stringify(note.related_topics) : null, note.citations ? JSON.stringify(note.citations) : null,
        note.confidence_score || 0.5, note.topic_path || null);
    });
    console.log(`Seeded ${notes.length} notes`);

    questions.forEach(q => {
      const options = q.options ? JSON.stringify(q.options) : null;
      db.prepare(`
        INSERT INTO questions (id, topic_id, type, question, options, correct_answer, explanation, subject, exam_tags, semester, difficulty, marks, source_reference)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(q.id, q.topic_id, q.type, q.question, options, q.correct_answer, q.explanation, q.subject, q.exam_tags, q.semester, q.difficulty, q.marks, q.source_reference);
    });
    console.log(`Seeded ${questions.length} questions`);

    flashcards.forEach(fc => {
      db.prepare(`
        INSERT INTO flashcards (id, front, back, subject, exam_tags, semester, difficulty)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(fc.id, fc.front, fc.back, fc.subject, fc.exam_tags, fc.semester, fc.difficulty);
    });
    console.log(`Seeded ${flashcards.length} flashcards`);

    // Seed doctrines
    const doctrines = [
      {
        id: 'doc-001', name: 'Basic Structure Doctrine', subject: 'Constitutional Law',
        description: 'Parliament cannot amend the Constitution in a way that destroys its basic structure or essential features.',
        origin_case: 'Kesavananda Bharati v. State of Kerala',
        origin_case_citation: 'AIR 1973 SC 1461',
        key_cases: ['Kesavananda Bharati v. State of Kerala (1973)', 'Minerva Mills v. Union of India (1980)', 'I.R. Coelho v. State of Tamil Nadu (2007)'],
        application: 'Used to strike down constitutional amendments that violate core constitutional values.',
        exam_tags: 'UP PCS-J,Judicial Services,Civil Judge,UPSC',
        semester: 3,
        related_sections: ['Article 368']
      },
      {
        id: 'doc-002', name: 'Doctrine of Proportionality', subject: 'Constitutional Law',
        description: 'State action restricting fundamental rights must be proportionate to the legitimate aim pursued.',
        origin_case: 'K.S. Puttaswamy v. Union of India',
        origin_case_citation: '(2017) 10 SCC 1',
        key_cases: ['K.S. Puttaswamy v. Union of India (2017)', 'Modern Dental College v. State of MP (2015)'],
        application: 'Applied to test restrictions on Articles 14, 19, and 21.',
        exam_tags: 'UP PCS-J,Judicial Services,Civil Judge,UPSC',
        semester: 3,
        related_sections: ['Article 14', 'Article 19', 'Article 21']
      },
      {
        id: 'doc-003', name: 'Doctrine of Harmonious Construction', subject: 'Constitutional Law',
        description: 'When two provisions conflict, they should be interpreted harmoniously to give effect to both.',
        origin_case: 'Venkataramana Devaru v. State of Mysore',
        origin_case_citation: 'AIR 1958 SC 255',
        key_cases: ['Venkataramana Devaru v. State of Mysore (1958)', 'Minerva Mills v. Union of India (1980)'],
        application: 'Used to resolve conflicts between Fundamental Rights and DPSP.',
        exam_tags: 'UP PCS-J,Judicial Services,UPSC',
        semester: 3,
        related_sections: ['Part III', 'Part IV']
      },
      {
        id: 'doc-004', name: 'Doctrine of Severability', subject: 'Constitutional Law',
        description: 'If part of a statute is unconstitutional, the valid portion can be severed and upheld.',
        origin_case: 'A.K. Gopalan v. State of Madras',
        origin_case_citation: 'AIR 1950 SC 27',
        key_cases: ['A.K. Gopalan v. State of Madras (1950)', 'R.M.D. Chamarbaugwalla v. Union of India (1957)'],
        application: 'Applied when striking down unconstitutional provisions while preserving the rest of the statute.',
        exam_tags: 'UP PCS-J,Judicial Services',
        semester: 3,
        related_sections: ['Article 13']
      },
      {
        id: 'doc-005', name: 'Res Judicata', subject: 'Civil Procedure',
        description: 'A matter already decided by a competent court cannot be re-litigated between the same parties.',
        origin_case: 'Section 11 CPC',
        origin_case_citation: 'Code of Civil Procedure, 1908',
        key_cases: ['Daryao v. State of UP (1961)', 'Satyadhyan Ghosal v. Deorajin Debi (1960)'],
        application: 'Bars trial of suits or issues already finally decided.',
        exam_tags: 'UP PCS-J,Judicial Services,Civil Judge,Bar Exam',
        semester: 4,
        related_sections: ['Section 11 CPC']
      },
      {
        id: 'doc-006', name: 'Neighbor Principle', subject: 'Law of Torts',
        description: 'A person must take reasonable care to avoid acts that could foreseeably injure their neighbor.',
        origin_case: 'Donoghue v. Stevenson',
        origin_case_citation: '[1932] AC 562',
        key_cases: ['Donoghue v. Stevenson (1932)', 'Caparo v. Dickman (1990)'],
        application: 'Foundation of modern negligence law and duty of care analysis.',
        exam_tags: 'UP PCS-J,Judicial Services,LLB,Bar Exam',
        semester: 2,
        related_sections: []
      }
    ];

    doctrines.forEach(d => {
      db.prepare(`
        INSERT INTO doctrines (id, name, description, subject, origin_case, origin_case_citation,
          key_cases, application, exam_tags, semester, related_sections)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(d.id, d.name, d.description, d.subject, d.origin_case, d.origin_case_citation,
        JSON.stringify(d.key_cases), d.application, d.exam_tags, d.semester, JSON.stringify(d.related_sections));
    });
    console.log(`Seeded ${doctrines.length} doctrines`);

    // Seed landmark cases
    const landmarkCases = [
      {
        id: 'case-001', case_name: 'Kesavananda Bharati v. State of Kerala', citation: 'AIR 1973 SC 1461',
        court: 'Supreme Court of India', year: 1973, subject: 'Constitutional Law',
        bench_strength: '13 judges',
        facts: 'Petitioner challenged the Kerala Land Reforms Amendment Act 1969 and the 24th, 25th, and 29th Constitutional Amendments.',
        issues: 'Whether Parliament has unlimited amending power under Article 368? Can Fundamental Rights be amended?',
        holding: 'Parliament can amend any part of the Constitution including Fundamental Rights, but cannot destroy the basic structure.',
        ratio: 'Basic Structure Doctrine - Parliament\'s amending power is limited by the basic structure of the Constitution.',
        significance: 'Most important constitutional law case in India. Established the basic structure limitation on parliamentary power.',
        exam_tags: 'UP PCS-J,Judicial Services,Civil Judge,UPSC',
        semester: 3,
        related_sections: ['Article 368'],
        related_doctrines: ['Basic Structure Doctrine']
      },
      {
        id: 'case-002', case_name: 'Maneka Gandhi v. Union of India', citation: 'AIR 1978 SC 597',
        court: 'Supreme Court of India', year: 1978, subject: 'Constitutional Law',
        bench_strength: '7 judges',
        facts: 'Maneka Gandhi\'s passport was impounded by the government without hearing. She challenged the action under Article 21.',
        issues: 'Whether procedure established by law under Article 21 must be fair, just, and reasonable?',
        holding: 'Procedure established by law must be fair, just, and reasonable, not merely prescribed by law.',
        ratio: 'Article 21 requires due process, not just procedure established by law. Articles 14, 19, and 21 form a golden triangle.',
        significance: 'Transformed Article 21 from a narrow provision to the most dynamic fundamental right.',
        exam_tags: 'UP PCS-J,Judicial Services,Civil Judge,UPSC',
        semester: 3,
        related_sections: ['Article 14', 'Article 19', 'Article 21'],
        related_doctrines: ['Doctrine of Proportionality']
      },
      {
        id: 'case-003', case_name: 'K.S. Puttaswamy v. Union of India', citation: '(2017) 10 SCC 1',
        court: 'Supreme Court of India', year: 2017, subject: 'Constitutional Law',
        bench_strength: '9 judges',
        facts: 'Challenge to Aadhaar scheme on grounds of violation of right to privacy.',
        issues: 'Whether right to privacy is a fundamental right under the Constitution?',
        holding: 'Right to privacy is a fundamental right under Article 21 and Part III of the Constitution.',
        ratio: 'Privacy is an intrinsic part of the right to life and personal liberty under Article 21.',
        significance: 'Overruled M.P. Sharma and Kharak Singh. Established privacy as a fundamental right.',
        exam_tags: 'UP PCS-J,Judicial Services,Civil Judge,UPSC',
        semester: 3,
        related_sections: ['Article 21'],
        related_doctrines: ['Doctrine of Proportionality']
      },
      {
        id: 'case-004', case_name: 'Donoghue v. Stevenson', citation: '[1932] AC 562',
        court: 'House of Lords', year: 1932, subject: 'Law of Torts',
        bench_strength: '5 Law Lords',
        facts: 'Mrs. Donoghue consumed ginger beer bought by her friend. Decomposed snail in bottle caused gastroenteritis.',
        issues: 'Whether manufacturer owes duty of care to ultimate consumer?',
        holding: 'Manufacturer owes duty of care to ultimate consumer.',
        ratio: 'Neighbor Principle - you must take reasonable care to avoid acts that could foreseeably injure your neighbor.',
        significance: 'Foundation of modern negligence law. Established duty of care in tort.',
        exam_tags: 'UP PCS-J,Judicial Services,LLB,Bar Exam',
        semester: 2,
        related_sections: [],
        related_doctrines: ['Neighbor Principle']
      },
      {
        id: 'case-005', case_name: 'Carlill v. Carbolic Smoke Ball Co.', citation: '[1893] 1 QB 256',
        court: 'Court of Appeal', year: 1893, subject: 'Contract Law',
        bench_strength: '3 judges',
        facts: 'Company advertised reward for anyone who used their product and still got influenza. Mrs. Carlill used it and got sick.',
        issues: 'Whether advertisement constitutes a binding offer? Is notification of acceptance required for unilateral contracts?',
        holding: 'Advertisement was a binding offer. Performance of conditions constitutes acceptance.',
        ratio: 'General offers can be accepted by performance without notification. Unilateral contracts are binding.',
        significance: 'Landmark case on general offers and unilateral contracts.',
        exam_tags: 'UP PCS-J,Judicial Services,LLB,Bar Exam',
        semester: 2,
        related_sections: ['Section 2(a)', 'Section 2(b)', 'Section 8'],
        related_doctrines: []
      },
      {
        id: 'case-006', case_name: 'Minerva Mills v. Union of India', citation: 'AIR 1980 SC 1789',
        court: 'Supreme Court of India', year: 1980, subject: 'Constitutional Law',
        bench_strength: '5 judges',
        facts: 'Challenge to the 42nd Amendment which gave DPSP primacy over Fundamental Rights.',
        issues: 'Whether 42nd Amendment provisions violating basic structure are valid?',
        holding: '42nd Amendment provisions struck down. Judicial review is part of basic structure.',
        ratio: 'Harmony between FR and DPSP is part of basic structure. Judicial review cannot be taken away.',
        significance: 'Reinforced basic structure doctrine. Struck down parts of 42nd Amendment.',
        exam_tags: 'UP PCS-J,Judicial Services,Civil Judge,UPSC',
        semester: 3,
        related_sections: ['Article 368'],
        related_doctrines: ['Basic Structure Doctrine', 'Doctrine of Harmonious Construction']
      }
    ];

    landmarkCases.forEach(c => {
      db.prepare(`
        INSERT INTO landmark_cases (id, case_name, citation, court, year, subject, bench_strength,
          facts, issues, holding, ratio, significance, exam_tags, semester,
          related_sections, related_doctrines)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(c.id, c.case_name, c.citation, c.court, c.year, c.subject, c.bench_strength,
        c.facts, c.issues, c.holding, c.ratio, c.significance, c.exam_tags, c.semester,
        JSON.stringify(c.related_sections), JSON.stringify(c.related_doctrines));
    });
    console.log(`Seeded ${landmarkCases.length} landmark cases`);

    // Seed sections
    const sections = [
      {
        id: 'sec-001', section_number: '14', act_name: 'Constitution of India', act_year: 1950,
        title: 'Equality before law', subject: 'Constitutional Law',
        text: 'The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India.',
        explanation: 'Twin test: (1) Equality before law - English concept, negative; (2) Equal protection of laws - American concept, positive. Reasonable classification test: intelligible differentia + rational nexus.',
        exam_tags: 'UP PCS-J,Judicial Services,Civil Judge,UPSC',
        semester: 3,
        related_cases: ['State of West Bengal v. Anwar Ali Sarkar (1952)', 'E.P. Royappa v. State of Tamil Nadu (1974)'],
        related_sections: ['Article 15', 'Article 16']
      },
      {
        id: 'sec-002', section_number: '19', act_name: 'Constitution of India', act_year: 1950,
        title: 'Protection of certain rights regarding freedom of speech, etc.', subject: 'Constitutional Law',
        text: 'All citizens shall have the right to freedom of speech and expression, assembly, association, movement, residence, and profession.',
        explanation: 'Six freedoms available only to citizens. Subject to reasonable restrictions under clauses (2) to (6).',
        exam_tags: 'UP PCS-J,Judicial Services,Civil Judge,UPSC',
        semester: 3,
        related_cases: ['Romesh Thappar v. State of Madras (1950)', 'Shreya Singhal v. Union of India (2015)'],
        related_sections: ['Article 14', 'Article 21']
      },
      {
        id: 'sec-003', section_number: '21', act_name: 'Constitution of India', act_year: 1950,
        title: 'Protection of life and personal liberty', subject: 'Constitutional Law',
        text: 'No person shall be deprived of his life or personal liberty except according to procedure established by law.',
        explanation: 'Most dynamic fundamental right. Interpreted to include right to privacy, livelihood, clean environment, health, education, speedy trial, legal aid, and die with dignity.',
        exam_tags: 'UP PCS-J,Judicial Services,Civil Judge,UPSC',
        semester: 3,
        related_cases: ['Maneka Gandhi v. Union of India (1978)', 'K.S. Puttaswamy v. Union of India (2017)'],
        related_sections: ['Article 14', 'Article 19']
      },
      {
        id: 'sec-004', section_number: '368', act_name: 'Constitution of India', act_year: 1950,
        title: 'Power of Parliament to amend the Constitution', subject: 'Constitutional Law',
        text: 'Parliament may in exercise of its constituent power amend by way of addition, variation or repeal any provision of the Constitution.',
        explanation: 'Subject to basic structure doctrine (Kesavananda Bharati). Cannot destroy essential features of the Constitution.',
        exam_tags: 'UP PCS-J,Judicial Services,Civil Judge,UPSC',
        semester: 3,
        related_cases: ['Kesavananda Bharati v. State of Kerala (1973)', 'Minerva Mills v. Union of India (1980)'],
        related_sections: []
      },
      {
        id: 'sec-005', section_number: '10', act_name: 'Indian Contract Act', act_year: 1872,
        title: 'What agreements are contracts', subject: 'Contract Law',
        text: 'All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object.',
        explanation: 'Essential elements: offer and acceptance, intention to create legal relations, lawful consideration, capacity, free consent, lawful object.',
        exam_tags: 'UP PCS-J,Judicial Services,LLB,Bar Exam',
        semester: 2,
        related_cases: ['Mohiri Bibi v. Dharmodas Ghose (1903)', 'Carlill v. Carbolic Smoke Ball Co. (1893)'],
        related_sections: ['Section 2(h)', 'Section 2(d)', 'Section 11']
      },
      {
        id: 'sec-006', section_number: '11', act_name: 'Code of Civil Procedure', act_year: 1908,
        title: 'Res judicata', subject: 'Civil Procedure',
        text: 'No court shall try any suit or issue in which the matter directly and substantially in issue has been directly and substantially in issue in a former suit between the same parties, and has been heard and finally decided.',
        explanation: 'Essential conditions: matter directly and substantially in issue, same parties, same title, competent court, heard and finally decided. Includes constructive res judicata (Explanation IV).',
        exam_tags: 'UP PCS-J,Judicial Services,Civil Judge,Bar Exam',
        semester: 4,
        related_cases: ['Daryao v. State of UP (1961)', 'Satyadhyan Ghosal v. Deorajin Debi (1960)'],
        related_sections: ['Section 10 CPC']
      }
    ];

    sections.forEach(s => {
      db.prepare(`
        INSERT INTO sections (id, section_number, act_name, act_year, title, text, explanation,
          subject, exam_tags, semester, related_cases, related_sections)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(s.id, s.section_number, s.act_name, s.act_year, s.title, s.text, s.explanation,
        s.subject, s.exam_tags, s.semester, JSON.stringify(s.related_cases), JSON.stringify(s.related_sections));
    });
    console.log(`Seeded ${sections.length} sections`);

    // Seed topic graph relationships
    const topicGraph = [
      { from: 'topic-001', to: 'topic-002', relation: 'prerequisite', strength: 0.9 },
      { from: 'topic-002', to: 'topic-003', relation: 'related', strength: 0.8 },
      { from: 'topic-003', to: 'topic-005', relation: 'related', strength: 0.7 },
      { from: 'topic-006', to: 'topic-009', relation: 'prerequisite', strength: 0.8 },
      { from: 'topic-016', to: 'topic-017', relation: 'prerequisite', strength: 0.9 },
      { from: 'topic-016', to: 'topic-018', relation: 'prerequisite', strength: 0.8 },
      { from: 'topic-021', to: 'topic-022', relation: 'prerequisite', strength: 0.9 },
      { from: 'topic-022', to: 'topic-023', relation: 'prerequisite', strength: 0.8 },
    ];

    topicGraph.forEach((tg, i) => {
      db.prepare(`
        INSERT INTO topic_graph (id, from_topic_id, to_topic_id, relation_type, strength)
        VALUES (?, ?, ?, ?, ?)
      `).run(`tg-${String(i + 1).padStart(3, '0')}`, tg.from, tg.to, tg.relation, tg.strength);
    });
    console.log(`Seeded ${topicGraph.length} topic graph edges`);

    const mcqIds = questions.filter(q => q.type === 'mcq').map(q => `'${q.id}'`).join(',');
    const shortIds = questions.filter(q => q.type === 'short').map(q => `'${q.id}'`).join(',');
    const longIds = questions.filter(q => q.type === 'long').map(q => `'${q.id}'`).join(',');
    const allIds = [mcqIds, shortIds, longIds].filter(Boolean).join(',');

    if (allIds) {
      const testId = uuidv4();
      db.prepare(`
        INSERT INTO tests (id, title, description, exam_type, subject, duration_minutes, total_marks, passing_marks, question_ids)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        testId, 'UP PCS-J Constitutional Law Mock Test', 'Sample mock test covering Constitutional Law fundamentals for UP PCS-J', 'UP PCS-J',
        'Constitutional Law', 30, 25, 10, allIds.replace(/'/g, '')
      );
      console.log('Seeded 1 mock test');
    }

    db.save();
    console.log('\nDatabase seeded successfully!');
    console.log('\nDemo Accounts:');
    console.log('Admin: admin@lexprep.ai / admin123');
    console.log('Student: student@lexprep.ai / student123');
    console.log('\nContent Summary:');
    console.log(`  Books: ${books.length}`);
    console.log(`  Topics: ${topics.length}`);
    console.log(`  Notes: ${notes.length}`);
    console.log(`  Questions: ${questions.length}`);
    console.log(`  Flashcards: ${flashcards.length}`);
    console.log(`  Doctrines: ${doctrines.length}`);
    console.log(`  Landmark Cases: ${landmarkCases.length}`);
    console.log(`  Sections: ${sections.length}`);
    console.log(`  Topic Graph Edges: ${topicGraph.length}`);

  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
