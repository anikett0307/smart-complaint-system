const db = require('./db');

const addImage = async (complaint_id, url) => {
  const res = await db.query(
    `INSERT INTO complaint_images(complaint_id, url, created_at) VALUES($1,$2,NOW()) RETURNING *`,
    [complaint_id, url]
  );
  return res.rows[0];
};

module.exports = { addImage };
