const db = require('../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

// Secret key (store in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; //

// Register user
exports.registerUser = (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Hashing error' });

    const sql = 'INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4)';
    db.query(sql, [name, email, phone, hash], (err, result) => {
      if (err) {
        if (err.code === '23505') { // Unique violation in PostgreSQL
          return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};

// Login


 exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = $1';  // Use $1 for PostgreSQL
  db.query(sql, [email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.rows.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = result.rows[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ error: 'Comparison error' });
      if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

      // Generate JWT Token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }  // Token valid for 1 hour
      );

      res.status(200).json({
        message: 'Login successful',
        token, // send token
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      });
    });
  });
};
// Get all users
exports.getAllUsers = (req, res) => {
  const sql = 'SELECT id, name, email, phone FROM users';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results.rows);
  });
};

// Get user by ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT id, name, email, phone FROM users WHERE id = $1';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(results.rows[0]);
  });
};

// Update user
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  const sql = 'UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4';
  db.query(sql, [name, email, phone, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.rowCount === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated successfully' });
  });
};

// Delete user
exports.deleteUser = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM users WHERE id = $1';
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.rowCount === 0) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  });
};
