const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.use(adminOnly);

router.get('/stats', adminController.getDashboardStats);
router.post('/content', adminController.createContent);
router.post('/bulk-import', adminController.bulkImport);
router.delete('/content', adminController.deleteContent);
router.get('/search-logs', adminController.getSearchLogs);

module.exports = router;
