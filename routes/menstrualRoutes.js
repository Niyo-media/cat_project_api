const express = require('express');
const router = express.Router();
const menstrualController = require('../controllers/menstrualController');

// Route to submit menstrual info
router.post('/submit', menstrualController.submitInfo);

// Route to get summary and fertile window
router.get('/submit/:userId', menstrualController.getSummary); // or another controller method



// Update Menstrual Info by ID
router.put('/update/:id', menstrualController.updateInfo);

// Delete Menstrual Info by ID
router.delete('/delete/:id', menstrualController.deleteInfo);
module.exports = router;
