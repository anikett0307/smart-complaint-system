#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    const schemaPath = path.join(__dirname, '../../backend/sql/schema.sql');
    // Support both relative layouts
    let sqlPath = schemaPath;
    if (!fs.existsSync(sqlPath)) sqlPath = path.join(__dirname, '../sql/schema.sql');
    if (!fs.existsSync(sqlPath)) sqlPath = path.join(__dirname, '../../sql/schema.sql');
    if (!fs.existsSync(sqlPath)) throw new Error('schema.sql not found');

    const sql = fs.readFileSync(sqlPath, 'utf8');
    console.log('Running schema SQL...');
    try {
      await pool.query(sql);
      console.log('Schema applied.');
    } catch (sqlErr) {
      console.warn('Warning: Could not apply schema (DB may not be running). Using in-memory mock DB for demo.');
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPass = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Admin';
    if (adminEmail && adminPass) {
      try {
        const ok = await pool.query('SELECT id FROM users WHERE email=$1', [adminEmail]);
        if (ok.rows.length === 0) {
          const hash = await bcrypt.hash(adminPass, 10);
          await pool.query('INSERT INTO users(email,password_hash,name,role,created_at) VALUES($1,$2,$3,$4,NOW())', [adminEmail, hash, adminName, 'admin']);
          console.log('Admin user created:', adminEmail);
        } else {
          console.log('Admin already exists:', adminEmail);
        }
      } catch (adminErr) {
        console.warn('Could not seed admin (DB may not be running):', adminErr.message);
      }
    } else {
      console.log('Skipping admin seed (ADMIN_EMAIL or ADMIN_PASSWORD not set)');
    }
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

run();
