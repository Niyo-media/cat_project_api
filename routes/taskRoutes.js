const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// POST: Submit tasks
router.post('/TaskRegister', taskController.submitTasks);

// GET: Get tasks by user ID
router.get('/tasks/:userId', taskController.getTasks); // Better endpoint
// ✅ PUT: Update task by task ID
router.put('/tasks/:taskId', taskController.updateTask);

// ✅ DELETE: Delete task by task ID
router.delete('/tasks/:taskId', taskController.deleteTask);

module.exports = router;
