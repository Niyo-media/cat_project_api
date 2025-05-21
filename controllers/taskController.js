const db = require('../config/db');

// ✅ Submit tasks for a user
exports.submitTasks = (req, res) => {
  const { userId, drink, eat, sleep } = req.body;

  if (
    !userId || isNaN(userId) ||
    typeof drink === 'undefined' ||
    typeof eat === 'undefined' ||
    typeof sleep === 'undefined'
  ) {
    return res.status(400).json({
      message: 'All fields are required: numeric userId, drink, eat, sleep',
    });
  }

  const sql = 'INSERT INTO tasks (user_id, drink, eat, sleep) VALUES (?, ?, ?, ?)';
  const values = [userId, drink, eat, sleep];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('❌ Submit Task Error:', err);
      return res.status(500).json({
        message: 'Failed to submit tasks',
        error: err.sqlMessage || err.message,
      });
    }

    return res.status(200).json({
      message: '✅ Tasks submitted successfully',
      taskId: result.insertId,
    });
  });
};

// ✅ Retrieve tasks by user ID
exports.getTasks = (req, res) => {
  const userId = req.params.userId;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: 'Valid numeric User ID is required in the URL' });
  }

  const sql = 'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('❌ Get Tasks Error:', err);
      return res.status(500).json({
        message: 'Failed to retrieve tasks',
        error: err.sqlMessage || err.message,
      });
    }

    return res.status(200).json({ tasks: results });
  });
};

// ✅ Update a task by task ID
exports.updateTask = (req, res) => {
  const taskId = req.params.taskId;
  const { drink, eat, sleep } = req.body;

  if (
    typeof drink === 'undefined' ||
    typeof eat === 'undefined' ||
    typeof sleep === 'undefined'
  ) {
    return res.status(400).json({
      message: 'Fields required: drink, eat, sleep',
    });
  }

  const sql = 'UPDATE tasks SET drink = ?, eat = ?, sleep = ? WHERE id = ?';

  db.query(sql, [drink, eat, sleep, taskId], (err, result) => {
    if (err) {
      console.error('❌ Update Task Error:', err);
      return res.status(500).json({
        message: 'Failed to update task',
        error: err.sqlMessage || err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json({ message: '✅ Task updated successfully' });
  });
};

// ✅ Delete a task by task ID
exports.deleteTask = (req, res) => {
  const taskId = req.params.taskId;

  const sql = 'DELETE FROM tasks WHERE id = ?';

  db.query(sql, [taskId], (err, result) => {
    if (err) {
      console.error('❌ Delete Task Error:', err);
      return res.status(500).json({
        message: 'Failed to delete task',
        error: err.sqlMessage || err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json({ message: '✅ Task deleted successfully' });
  });
};
