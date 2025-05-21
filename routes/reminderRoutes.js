const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');

router.post('/set', reminderController.setReminder);      // POST /api/reminders/set
router.get('/:userId', reminderController.getReminders);  // GET /api/reminders/:userId
router.put('/update/:id', reminderController.updateReminder);
router.delete('/delete/:id', reminderController.deleteReminder);

module.exports = router;
