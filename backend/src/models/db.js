let pool = null;
let usePostgres = false;

const mockDb = require('./mockDb'); // ✅ MUST MATCH FILE NAME EXACTLY

try {
  const { Pool } = require('pg');
  const connStr =
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/smart_complaints';

  pool = new Pool({ connectionString: connStr });

  pool.on('error', err => {
    console.warn('[DB] PostgreSQL error:', err.message);
    pool = null;
    usePostgres = false;
  });

  usePostgres = true;
  console.log('[DB] PostgreSQL pool created');
} catch (err) {
  console.log('[DB] PostgreSQL not available, using mock DB');
  pool = null;
  usePostgres = false;
}

module.exports = {
  query: async (sql, params = []) => {
    if (usePostgres && pool) {
      try {
        return await pool.query(sql, params);
      } catch (err) {
        console.log('[DB] Query failed, falling back to mock DB:', err.message);
        usePostgres = false;
        return mockDb.query(sql, params);
      }
    }
    return mockDb.query(sql, params);
  }
};
