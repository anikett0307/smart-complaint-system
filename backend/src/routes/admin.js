const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const complaintModel = require('../models/complaintModel');

// Admin: list complaints with optional sort by priority or status
router.get('/complaints', auth, admin, async (req, res) => {
  try {
    let data = await complaintModel.listComplaints();
    const sort = req.query.sort;
    if (sort === 'priority') {
      const order = { High: 1, Medium: 2, Low: 3 };
      data = data.sort((a,b)=> (order[a.priority]||99) - (order[b.priority]||99));
    }
    res.json({ data });
  } catch (err) { res.status(500).json({ error: 'Server error' }); }
});

module.exports = router;
