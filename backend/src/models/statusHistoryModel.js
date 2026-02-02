const db = require('./db');

// Add a status history record (memory bank)
const addHistory = async (record) => {
  const { complaint_id, old_status, new_status, admin_id, admin_email, remark } = record;
  
  const res = await db.query(
    `INSERT INTO status_history(complaint_id, old_status, new_status, admin_id, admin_email, remark, created_at)
     VALUES($1, $2, $3, $4, $5, $6, NOW())
     RETURNING *`,
    [complaint_id, old_status, new_status, admin_id, admin_email, remark || '']
  );
  
  return res.rows[0];
};

// Get history for a complaint
const getHistoryByComplaintId = async (complaint_id) => {
  const res = await db.query(
    `SELECT * FROM status_history
     WHERE complaint_id = $1
     ORDER BY created_at ASC`,
    [complaint_id]
  );
  
  return res.rows;
};

module.exports = { addHistory, getHistoryByComplaintId };
