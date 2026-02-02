const { createComplaint, getAllComplaints } = require("../models/mockDB");

/**
 * Create a new complaint (supports photo upload)
 * Uses SAME AI logic as preview
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

    // 🔁 SAME AI LOGIC AS PREVIEW
    const text = `${title} ${description}`.toLowerCase();

    const HIGH_RISK = {
      accident: 5,
      fire: 5,
      emergency: 5,
      danger: 4,
      injured: 4,
      hospital: 3
    };

    const MEDIUM_RISK = {
      "not working": 3,
      broken: 3,
      damaged: 2,
      delay: 2,
      leakage: 2,
      power: 2
    };

    const LOW_RISK = {
      noise: 1,
      dirty: 1,
      garbage: 1,
      slow: 1
    };

    let score = 0;
    const calculateScore = (keywords) => {
      Object.keys(keywords).forEach(word => {
        if (text.includes(word)) {
          score += keywords[word];
        }
      });
    };

    calculateScore(HIGH_RISK);
    calculateScore(MEDIUM_RISK);
    calculateScore(LOW_RISK);

    let priority = "Low";
    if (score >= 7) priority = "High";
    else if (score >= 3) priority = "Medium";

    const complaint = createComplaint({
      title,
      description,
      category,
      location,
      photo,
      priority
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
    return res.status(400).json({ message: "Title and description required" });
  }

  const text = `${title} ${description}`.toLowerCase();

  const HIGH_RISK = {
    accident: 5,
    fire: 5,
    emergency: 5,
    danger: 4,
    injured: 4,
    hospital: 3
  };

  const MEDIUM_RISK = {
    "not working": 3,
    broken: 3,
    damaged: 2,
    delay: 2,
    leakage: 2,
    power: 2
  };

  const LOW_RISK = {
    noise: 1,
    dirty: 1,
    garbage: 1,
    slow: 1
  };

  let score = 0;

  const calculateScore = (keywords) => {
    Object.keys(keywords).forEach(word => {
      if (text.includes(word)) {
        score += keywords[word];
      }
    });
  };

  calculateScore(HIGH_RISK);
  calculateScore(MEDIUM_RISK);
  calculateScore(LOW_RISK);

  let priority = "Low";
  if (score >= 7) priority = "High";
  else if (score >= 3) priority = "Medium";

  res.json({
    priority,
    score,
    confidence: `${Math.min(95, score * 10)}%`
  });
};
