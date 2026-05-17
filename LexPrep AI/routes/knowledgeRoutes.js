const express = require('express');
const router = express.Router();
const knowledgeController = require('../controllers/knowledgeController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/dashboard', optionalAuth, knowledgeController.getDashboardData);
router.get('/hierarchy', optionalAuth, knowledgeController.getTopicHierarchy);
router.get('/hierarchy/:subject', optionalAuth, knowledgeController.getSubjectHierarchy);
router.get('/graph/:topicId', optionalAuth, knowledgeController.getTopicGraph);
router.get('/search', optionalAuth, knowledgeController.globalSearch);
router.get('/revision-queue', optionalAuth, knowledgeController.getRevisionQueue);
router.get('/stats', optionalAuth, knowledgeController.getStats);

router.get('/doctrines', optionalAuth, knowledgeController.getDoctrines);
router.get('/doctrines/:id', optionalAuth, knowledgeController.getDoctrineById);

router.get('/cases', optionalAuth, knowledgeController.getLandmarkCases);
router.get('/cases/:id', optionalAuth, knowledgeController.getCaseById);

router.get('/sections', optionalAuth, knowledgeController.getSections);
router.get('/sections/:id', optionalAuth, knowledgeController.getSectionById);
router.get('/sections/acts', optionalAuth, knowledgeController.getActsList);

module.exports = router;
