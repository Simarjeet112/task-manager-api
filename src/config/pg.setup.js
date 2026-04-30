require('dotenv').config();
const pool = require('./db.postgres');

const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  try {
    await pool.query(query);
    console.log('Users table ready');
    process.exit(0);
  } catch (err) {
    console.error('Failed to create users table:', err.message);
    process.exit(1);
  }
};

createUsersTable();