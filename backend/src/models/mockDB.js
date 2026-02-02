const bcrypt = require('bcrypt');

const db = {
  users: [],
  complaints: []
};

let userId = 1;
let complaintId = 1;

// seed admin
(async () => {
  const hash = await bcrypt.hash('admin123', 10);
  db.users.push({
    id: userId++,
    email: 'admin@example.com',
    password_hash: hash,
    name: 'Admin',
    role: 'admin'
  });
  console.log('[MOCK DB] Admin seeded');
})();

module.exports = {
  async query(sql, params) {
    // USERS
    if (sql.includes('FROM users WHERE email')) {
      const u = db.users.find(u => u.email === params[0]);
      return { rows: u ? [u] : [] };
    }

    if (sql.includes('INSERT INTO users')) {
      const user = {
        id: userId++,
        email: params[0],
        password_hash: params[1],
        name: params[2],
        role: params[3]
      };
      db.users.push(user);
      return { rows: [user] };
    }

    // COMPLAINTS
    if (sql.includes('INSERT INTO complaints')) {
      const complaint = {
        id: complaintId++,
        user_id: params[0],
        title: params[1],
        description: params[2],
        category: params[3],
        location: params[4],
        priority: params[5],
        photo: params[6],
        created_at: new Date()
      };
      db.complaints.push(complaint);
      console.log('[MOCK DB] Complaint inserted:', complaint);
      return { rows: [complaint] };
    }

    if (sql.includes('FROM complaints') && sql.includes('user_id')) {
      const rows = db.complaints.filter(c => c.user_id === params[0]);
      return { rows };
    }

    return { rows: [] };
  }
};
