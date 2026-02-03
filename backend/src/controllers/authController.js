const bcrypt = require("bcrypt");
const { mockDB } = require("../models/db.mock");

/**
 * Register user
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = mockDB.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      id: mockDB.users.length + 1,
      name,
      email,
      password: hashedPassword,
      role: "user"
    };

    mockDB.users.push(user);

    res.status(201).json({
      message: "Registration successful"
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({
      message: "Registration failed"
    });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = mockDB.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      message: "Login failed"
    });
  }
};
