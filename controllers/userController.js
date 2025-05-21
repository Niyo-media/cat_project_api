const db = require('../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Register user
exports.registerUser = (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Hashing error' });

    const sql = 'INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, phone, hash], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};


// LOGIN
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Comparison error' });
      if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

      res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
    });
  });
};

// READ: Get all users
exports.getAllUsers = (req, res) => {
  const sql = 'SELECT id, name, email, phone FROM users';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
};

// READ: Get single user by ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT id, name, email, phone FROM users WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(results[0]);
  });
};

// UPDATE: Update user info
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  const sql = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?';
  db.query(sql, [name, email, phone, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated successfully' });
  });
};

// DELETE: Delete user by ID
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM users WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  });
};
