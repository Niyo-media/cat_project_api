// config/db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',         // Use your own MySQL password
  database: 'shesmart_db'
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL Connection Failed:', err);
  } else {
    console.log('✅ Connected to MySQL Database');
  }
});

module.exports = connection;
