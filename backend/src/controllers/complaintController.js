const { createComplaint, getAllComplaints } = require("../models/mockDB");

/**
 * Create a new complaint (supports photo upload)
 */
exports.createComplaint = (req, res) => {
  try {
    const { title, description, category, location } = req.body;
    const photo = req.file ? req.file.filename : null;

    // validation
    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const complaint = createComplaint({
      title,
      description,
      category,
      location,
      photo
    });

    res.status(201).json({
      success: true,
      complaint
    });
  } catch (error) {
    console.error("Create complaint error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to submit complaint"
    });
  }
};

/**
 * Get all complaints
 */
exports.getComplaints = (req, res) => {
  try {
    const complaints = getAllComplaints();

    res.status(200).json({
      success: true,
      complaints
    });
  } catch (error) {
    console.error("Get complaints error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints"
    });
  }
};

/**
 * Preview AI Priority (rule-based)
 */
exports.previewPriority = (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "Title and description required"
    });
  }

  const text = `${title} ${description}`.toLowerCase();

  let priority = "Low";
  if (
    text.includes("accident") ||
    text.includes("danger") ||
    text.includes("emergency")
  ) {
    priority = "High";
  } else if (
    text.includes("broken") ||
    text.includes("not working") ||
    text.includes("delay")
  ) {
    priority = "Medium";
  }

  res.json({ priority });
};
