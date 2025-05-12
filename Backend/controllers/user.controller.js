const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  const { email, username, password } = req.body;
  console.log("Incoming registration:", email, username);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    console.log("Inserting into DB...");
    db.run(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, hashedPassword],
      function (err) {
        console.log("Inside db.run callback");
        if (err) {
          console.error("Insert error:", err.message);
          return res.status(400).json({ error: 'User already exists or invalid data' });
        }
        console.log("User inserted with ID:", this.lastID);
        res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
      }
    );

  } catch (error) {
    console.error("Register catch:", error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, username: user.username });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProfile = (req, res) => {
  const userId = req.user.userId;
  db.get('SELECT id, email, username FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
};