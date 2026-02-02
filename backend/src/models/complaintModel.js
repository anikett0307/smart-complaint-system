const { pool } = require('./db');

const makeAbsoluteImageUrls = (complaint) => {
  if (!complaint.images) return complaint;
  return {
    ...complaint,
    images: complaint.images.map(img =>
      img.startsWith('http') ? img : `http://localhost:4000${img}`
    )
  };
};

// Create complaint
const createComplaint = async (c) => {
  const res = await pool.query(
    `INSERT INTO complaints
     (user_id, title, description, category, location, priority, status, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
     RETURNING *`,
    [
      c.user_id,
      c.title,
      c.description,
      c.category,
      c.location,
      c.priority,
      c.status || 'Pending'
    ]
  );
  return res.rows[0];
};

// Get complaint by ID
const getComplaintById = async (id) => {
  const res = await pool.query(
    `SELECT c.*, 
      COALESCE(json_agg(ci.image_url) FILTER (WHERE ci.image_url IS NOT NULL), '[]') AS images
     FROM complaints c
     LEFT JOIN complaint_images ci ON ci.complaint_id = c.id
     WHERE c.id = $1
     GROUP BY c.id`,
    [id]
  );

  if (!res.rows[0]) return null;
  return makeAbsoluteImageUrls(res.rows[0]);
};

// List complaints for a user
const listComplaintsByUserId = async (user_id) => {
  const res = await pool.query(
    `SELECT c.*, 
      COALESCE(json_agg(ci.image_url) FILTER (WHERE ci.image_url IS NOT NULL), '[]') AS images
     FROM complaints c
     LEFT JOIN complaint_images ci ON ci.complaint_id = c.id
     WHERE c.user_id = $1
     GROUP BY c.id
     ORDER BY c.created_at DESC`,
    [user_id]
  );

  return res.rows.map(r => makeAbsoluteImageUrls(r));
};

// List all complaints (admin)
const listComplaints = async () => {
  const res = await pool.query(
    `SELECT c.*, 
      COALESCE(json_agg(ci.image_url) FILTER (WHERE ci.image_url IS NOT NULL), '[]') AS images
     FROM complaints c
     LEFT JOIN complaint_images ci ON ci.complaint_id = c.id
     GROUP BY c.id
     ORDER BY c.created_at DESC`
  );

  return res.rows.map(r => makeAbsoluteImageUrls(r));
};

// Update complaint status
const updateStatus = async (id, status) => {
  await pool.query(
    `UPDATE complaints SET status = $1 WHERE id = $2`,
    [status, id]
  );
};

module.exports = {
  createComplaint,
  getComplaintById,
  listComplaintsByUserId,
  listComplaints,
  updateStatus
};
