const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const {
  createComplaint,
  previewPriority,
  getMyComplaints
} = require('../controllers/complaintController');

// ✅ AUTH REQUIRED (correct)
router.post(
  '/',
  auth,
  upload.single('photo'),
  createComplaint
);

router.post('/preview-priority', previewPriority);
router.get('/my', auth, getMyComplaints);

module.exports = router;
