const db = require('../config/db');

// CREATE - Set a new reminder
exports.setReminder = (req, res) => {
  const { userId, reminderText, reminderTime } = req.body || {};

  if (!userId || !reminderText || !reminderTime) {
    return res.status(400).json({
      message: 'All fields are required: userId, reminderText, reminderTime',
      received: req.body
    });
  }

  // Validate date format
  const dateTime = new Date(reminderTime);
  if (isNaN(dateTime.getTime())) {
    return res.status(400).json({ message: 'Invalid reminderTime format. Expected a valid datetime string.' });
  }

  // Sanitize text
  const sanitizedText = reminderText.trim();
  if (sanitizedText.length === 0) {
    return res.status(400).json({ message: 'Reminder text cannot be empty' });
  }

  const sql = 'INSERT INTO reminders (user_id, reminder_text, reminder_time) VALUES (?, ?, ?)';
  db.query(sql, [userId, sanitizedText, dateTime], (err, result) => {
    if (err) {
      console.error('Set Reminder Error:', err);
      const errorMessage = err.code === 'ER_NO_REFERENCED_ROW_2'
        ? 'Invalid user ID: no such user exists'
        : 'Database error';

      return res.status(500).json({
        message: 'Failed to set reminder',
        error: errorMessage,
        sqlError: err.message
      });
    }

    res.status(201).json({
      message: 'Reminder set successfully',
      reminderId: result.insertId
    });
  });
};

// READ - Get all reminders for a user
exports.getReminders = (req, res) => {
  const userId = req.params.userId;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const sql = 'SELECT * FROM reminders WHERE user_id = ? ORDER BY reminder_time ASC';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Get Reminders Error:', err);
      return res.status(500).json({ message: 'Failed to retrieve reminders' });
    }

    res.status(200).json({ reminders: results });
  });
};

// UPDATE - Update a reminder by IDconst db = require('../config/db');

exports.updateReminder = (req, res) => {
  const reminderId = req.params.id;

  // Log received input for debugging
  console.log('Update Request Body:', req.body);
  console.log('Reminder ID from params:', reminderId);

  const { reminderText, reminderTime } = req.body || {};

  // Validate input presence
  if (!reminderText || !reminderTime) {
    return res.status(400).json({
      message: 'Both reminderText and reminderTime are required',
      received: req.body
    });
  }

  // Validate reminderTime is a proper date
  const dateTime = new Date(reminderTime);
  if (isNaN(dateTime.getTime())) {
    return res.status(400).json({ message: 'Invalid reminder time format' });
  }

  // Sanitize reminderText
  const sanitizedText = reminderText.trim();
  if (sanitizedText.length === 0) {
    return res.status(400).json({ message: 'Reminder text cannot be empty' });
  }

  // Check if reminder exists
  const checkSql = 'SELECT id FROM reminders WHERE id = ?';
  db.query(checkSql, [reminderId], (err, rows) => {
    if (err) {
      console.error('Check Reminder Error:', err);
      return res.status(500).json({ message: 'Failed to verify reminder existence' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    // Perform the update
    const updateSql = 'UPDATE reminders SET reminder_text = ?, reminder_time = ? WHERE id = ?';
    db.query(updateSql, [sanitizedText, dateTime, reminderId], (err, result) => {
      if (err) {
        console.error('Update Reminder Error:', err);
        return res.status(500).json({ message: 'Failed to update reminder' });
      }

      res.status(200).json({ message: 'Reminder updated successfully' });
    });
  });
};

// DELETE - Delete a reminder by ID
exports.deleteReminder = (req, res) => {
  const reminderId = req.params.id;

  const checkSql = 'SELECT id FROM reminders WHERE id = ?';
  db.query(checkSql, [reminderId], (err, rows) => {
    if (err) {
      console.error('Check Reminder Error:', err);
      return res.status(500).json({ message: 'Failed to verify reminder existence' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    const deleteSql = 'DELETE FROM reminders WHERE id = ?';
    db.query(deleteSql, [reminderId], (err, result) => {
      if (err) {
        console.error('Delete Reminder Error:', err);
        return res.status(500).json({ message: 'Failed to delete reminder' });
      }

      res.status(200).json({ message: 'Reminder deleted successfully' });
    });
  });
};
