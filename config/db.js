// config/db.js
require('dotenv').config(); // Load environment variables from .env

const { Pool } = require('pg');

// Create PostgreSQL pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,  // Needed for Render and some cloud DBs
  },
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ PostgreSQL Connection Failed:', err.stack);
  }
  console.log('✅ Connected to PostgreSQL Database');
  release();
});

module.exports = pool;
