const db = require('./db');

const createUser = async (email, passwordHash, name, role = 'user') => {
  const res = await db.query(
    `INSERT INTO users(email, password_hash, name, role) VALUES($1,$2,$3,$4) RETURNING id,email,name,role`,
    [email, passwordHash, name, role]
  );
  return res.rows[0];
};

const findUserByEmail = async (email) => {
  const res = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
  return res.rows[0];
};

const findUserById = async (id) => {
  const res = await db.query(`SELECT id,email,name,role FROM users WHERE id=$1`, [id]);
  return res.rows[0];
};

module.exports = { createUser, findUserByEmail, findUserById };
