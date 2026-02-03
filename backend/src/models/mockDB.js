const bcrypt = require("bcrypt");

const mockDB = {
  users: [],
  complaints: []
};

let userId = 1;
let complaintId = 1;

/**
 * Seed Admin User
 */
(async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  mockDB.users.push({
    id: userId++,
    name: "Admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin"
  });

  console.log("✅ Mock Admin User Created");
})();

/**
 * Create Complaint
 */
function createComplaint(data) {
  const complaint = {
    id: ++complaintId,
    title: data.title,
    description: data.description,
    category: data.category,
    location: data.location,
    photo: data.photo || null,
    priority: data.priority || "Medium",
    status: "Pending",
    created_at: new Date()
  };

  mockDB.complaints.push(complaint);   // ✅ MUST be AFTER complaint is defined
  return complaint;
}



/**
 * Get All Complaints
 */
function getAllComplaints() {
  return mockDB.complaints;
}

module.exports = {
  mockDB,
  createComplaint,
  getAllComplaints
};
function updateStatus(id, newStatus, remark) {
  const complaint = mockDB.complaints.find(c => c.id === id);
  if (!complaint) return false;

  const oldStatus = complaint.status || "Pending";
  complaint.status = newStatus;

  // history array
  if (!mockDB.history) mockDB.history = [];

  mockDB.history.push({
    id: mockDB.history.length + 1,
    complaint_id: id,
    old_status: oldStatus,
    new_status: newStatus,
    remark,
    admin_email: "admin@example.com",
    created_at: new Date()
  });

  return true;
}

module.exports.updateStatus = updateStatus;
