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
    id: complaintId++,
    title: data.title,
    description: data.description,
    category: data.category,
    location: data.location,
    photo: data.photo || null,
    priority: "Medium",
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  mockDB.complaints.push(complaint);
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
