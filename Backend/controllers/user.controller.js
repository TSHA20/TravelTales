const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../config/db');

exports.register = async (req, res) => {
  const { email, username, password } = req.body;
  console.log("Incoming registration:", email, username);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    db.run(
      'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
      [email, username, hashedPassword],
      function (err) {
        if (err) {
          console.error("Insert error:", err.message);
          return res.status(400).json({ error: 'User already exists or invalid data' });
        }

        const token = jwt.sign({ userId: this.lastID }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const csrfToken = crypto.randomBytes(20).toString('hex');

        res
          .cookie('token', token, {
            httpOnly: true,
            sameSite: 'Lax',
            secure: false, // Set to true in production (HTTPS)
            maxAge: 3600000
          })
          .cookie('csrf_token', csrfToken, {
            httpOnly: false, // must be accessible from JS
            sameSite: 'Lax',
            secure: false,
            maxAge: 3600000
          })
          .status(201)
          .json({ message: 'User registered successfully', username, csrfToken });
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
      const csrfToken = crypto.randomBytes(20).toString('hex');

      res
        .cookie('token', token, {
          httpOnly: true,
          sameSite: 'Lax',
          secure: false,
          maxAge: 3600000
        })
        .cookie('csrf_token', csrfToken, {
          httpOnly: false,
          sameSite: 'Lax',
          secure: false,
          maxAge: 3600000
        })
        .json({
          message: 'Login successful',
          username: user.username,
          csrfToken,
          user: {
            id: user.id,
            email: user.email,
            username: user.username
          }
        });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProfile = (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  db.get('SELECT id, email, username FROM users WHERE id = ?', [userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  });
};

exports.getCurrentUser = (req, res) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  db.get('SELECT username FROM users WHERE id = ?', [userId], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ username: row.username });
  });
};
