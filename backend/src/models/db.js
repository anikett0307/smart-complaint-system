const { Pool } = require('pg');

let pool;

const connStr =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/smart_complaints';

pool = new Pool({ connectionString: connStr });

pool.on('connect', () => {
  console.log('[DB] PostgreSQL pool created');
});

pool.on('error', err => {
  console.error('[DB] PostgreSQL error:', err.message);
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};
