const express = require('express');
const router = express.Router();
const dailyMenuController = require('../controllers/dailyMenuController');
const { protect, authorize } = require('../middleware/auth');

// Public route to get today's menu
router.get('/', dailyMenuController.getDailyMenu);

// Kitchen/Admin route to get the 7-day schedule
router.get('/schedule', protect, authorize('restaurant', 'admin'), dailyMenuController.getSchedule);

// Kitchen/Admin route to set/override a daily menu
router.post('/override', protect, authorize('restaurant', 'admin'), dailyMenuController.setOverride);

// Kitchen/Admin route to delete an override for a specific date
router.delete('/override/:date', protect, authorize('restaurant', 'admin'), dailyMenuController.deleteOverride);

module.exports = router;
