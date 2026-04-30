const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('PostgreSQL connection error:', err.message);
  } else {
    console.log('PostgreSQL connected');
    release();
  }
});

module.exports = pool;