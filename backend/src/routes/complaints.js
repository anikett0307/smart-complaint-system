const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  createComplaint,
  getComplaints,
  previewPriority,
  updateComplaintStatus
} = require("../controllers/complaintController");

router.post("/", upload.single("photo"), createComplaint);
router.get("/", getComplaints);
router.post("/preview-priority", previewPriority);
router.put('/:id/status', updateComplaintStatus)

module.exports = router;
