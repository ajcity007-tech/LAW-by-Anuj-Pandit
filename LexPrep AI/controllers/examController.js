const Question = require('../models/Question');
const Test = require('../models/Test');
const { getDb } = require('../models/database');

function startExam(req, res) {
  try {
    const { test_id } = req.body;

    if (!test_id) {
      return res.status(400).json({ error: 'Test ID is required' });
    }

    const test = Test.findById(test_id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    const questions = test.questions.map(q => {
      const qData = {
        id: q.id,
        type: q.type,
        question: q.question,
        subject: q.subject,
        marks: q.marks,
        difficulty: q.difficulty
      };
      if (q.type === 'mcq' && q.options) {
        qData.options = JSON.parse(q.options);
      }
      return qData;
    });

    res.json({
      success: true,
      data: {
        test_id: test.id,
        title: test.title,
        exam_type: test.exam_type,
        subject: test.subject,
        duration_minutes: test.duration_minutes,
        total_marks: test.total_marks,
        passing_marks: test.passing_marks,
        question_count: questions.length,
        questions,
        started_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + test.duration_minutes * 60000).toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to start exam', details: err.message });
  }
}

function submitExam(req, res) {
  try {
    const { test_id, answers, time_taken_minutes } = req.body;
    const userId = req.user?.id;

    if (!test_id || !answers) {
      return res.status(400).json({ error: 'Test ID and answers are required' });
    }

    const test = Test.findById(test_id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    let score = 0;
    let totalMarks = 0;
    const detailedResults = [];

    test.questions.forEach(q => {
      totalMarks += q.marks || 1;
      const userAnswer = answers.find(a => a.question_id === q.id);
      let isCorrect = false;
      let marksObtained = 0;

      if (q.type === 'mcq') {
        if (userAnswer && userAnswer.answer === q.correct_answer) {
          isCorrect = true;
          marksObtained = q.marks || 1;
        }
      } else {
        if (userAnswer && userAnswer.answer) {
          marksObtained = (q.marks || 1) * 0.5;
        }
      }

      score += marksObtained;
      detailedResults.push({
        question_id: q.id,
        type: q.type,
        is_correct: isCorrect,
        marks_obtained: marksObtained,
        total_marks: q.marks || 1,
        correct_answer: q.correct_answer,
        explanation: q.explanation
      });
    });

    const percentage = totalMarks > 0 ? (score / totalMarks) * 100 : 0;
    const passed = percentage >= ((test.passing_marks / totalMarks) * 100);

    const result = Test.saveResult({
      user_id: userId,
      test_id,
      score,
      total_marks: totalMarks,
      percentage: parseFloat(percentage.toFixed(2)),
      answers,
      time_taken_minutes: time_taken_minutes || test.duration_minutes
    });

    const weakAreas = detailedResults.filter(r => !r.is_correct).map(r => r.question_id);

    res.json({
      success: true,
      data: {
        result_id: result.id,
        test_title: test.title,
        score,
        total_marks: totalMarks,
        percentage: parseFloat(percentage.toFixed(2)),
        passed,
        passing_marks: test.passing_marks,
        time_taken: time_taken_minutes,
        question_results: detailedResults,
        weak_areas: weakAreas.slice(0, 5),
        completed_at: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit exam', details: err.message });
  }
}

function getExamResults(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Authentication required' });

    const results = Test.getUserResults(userId);

    const stats = {
      total_tests: results.length,
      average_percentage: results.length > 0 ? (results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length).toFixed(2) : 0,
      passed: results.filter(r => {
        const test = Test.findById(r.test_id);
        return r.percentage >= ((test?.passing_marks || 0) / (r.total_marks || 1)) * 100;
      }).length,
      failed: results.length - results.filter(r => {
        const test = Test.findById(r.test_id);
        return r.percentage >= ((test?.passing_marks || 0) / (r.total_marks || 1)) * 100;
      }).length
    };

    res.json({ success: true, data: { results, stats } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch results', details: err.message });
  }
}

module.exports = { startExam, submitExam, getExamResults };
