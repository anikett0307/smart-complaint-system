const pool = require('../models/db');
const { getRuleBasedPriority } = require('../services/aiService');

exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    const photo = req.file ? req.file.filename : null;

    if (!title || !description || !category || !location) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const priority = getRuleBasedPriority(title, description).priority;

    const result = await pool.query(
      `INSERT INTO complaints
       (user_id, title, description, category, location, priority, photo)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        req.user.id,
        title,
        description,
        category,
        location,
        priority,
        photo
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    console.error('[CREATE COMPLAINT ERROR]', e.message);
    res.status(500).json({ message: 'Failed to submit complaint' });
  }
};

exports.getMyComplaints = async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM complaints WHERE user_id = $1`,
    [req.user.id]
  );
  res.json(result.rows);
};

exports.previewPriority = (req, res) => {
  const { title, description } = req.body;
  const priority = getRuleBasedPriority(title, description);
  res.json(priority);
};
