const db = require('../config/db');

// Submit Menstrual Info
exports.submitInfo = (req, res) => {
  const { userId, startDate, duration, cycleLength } = req.body;

  // Validate input
  if (!userId || !startDate || !duration || !cycleLength) {
    return res.status(400).json({
      message: 'All fields are required: userId, startDate, duration, cycleLength'
    });
  }

  // Insert into database
  const sql = `
    INSERT INTO menstrual_info (user_id, start_date, duration, cycle_length)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [userId, startDate, duration, cycleLength], (err, result) => {
    if (err) {
      console.error('Submit Info Error:', err);
      return res.status(500).json({ message: 'Failed to submit menstrual info' });
    }

    return res.status(200).json({
      message: 'Info submitted successfully',
      insertedId: result.insertId
    });
  });
};

exports.getSummary = (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT * FROM menstrual_info
    WHERE user_id = ?
    ORDER BY start_date DESC
    LIMIT 1
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Get Summary Error:', err);
      return res.status(500).json({ message: 'Failed to retrieve data' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No menstrual info found for this user' });
    }

    const info = results[0];

    // Calculate fertile window: ~14 days before next period
    const fertileStart = new Date(info.start_date);
    fertileStart.setDate(fertileStart.getDate() + info.cycle_length - 14);

    const fertileEnd = new Date(fertileStart);
    fertileEnd.setDate(fertileStart.getDate() + 6);

    return res.status(200).json({
      message: 'Summary retrieved successfully',
      info: {
        id: info.id,
        user_id: info.user_id,
        start_date: info.start_date,
        duration: info.duration,
        cycle_length: info.cycle_length
      },
      fertileWindow: {
        start: fertileStart.toISOString().split('T')[0],
        end: fertileEnd.toISOString().split('T')[0]
      }
    });
  });
};
// const db = require('../config/db'); // Adjust the path if your DB config is elsewhere

// UPDATE - Update Menstrual Info by ID
exports.updateInfo = (req, res) => {
  const id = req.params.id;
  const { start_date, duration, cycle_length } = req.body;

  // Validate required fields
  if (!start_date || !duration || !cycle_length) {
    return res.status(400).json({
      message: 'start_date, duration, and cycle_length are required',
      received: req.body
    });
  }

  const sql = `
    UPDATE menstrual_info
    SET start_date = ?, duration = ?, cycle_length = ?
    WHERE id = ?
  `;

  db.query(sql, [start_date, duration, cycle_length, id], (err, result) => {
    if (err) {
      console.error('Update Info Error:', err);
      return res.status(500).json({ message: 'Failed to update data' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No record found with the given ID' });
    }

    return res.status(200).json({ message: 'Menstrual info updated successfully' });
  });
};

// DELETE - Delete Menstrual Info by ID
exports.deleteInfo = (req, res) => {
  const id = req.params.id;

  const sql = `DELETE FROM menstrual_info WHERE id = ?`;

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Delete Info Error:', err);
      return res.status(500).json({ message: 'Failed to delete data' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No record found with the given ID' });
    }

    return res.status(200).json({ message: 'Menstrual info deleted successfully' });
  });
};

