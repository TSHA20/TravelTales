const db = require('../config/db');

exports.findByEmail = (email, callback) => {
  db.get('SELECT * FROM users WHERE email = ?', [email], callback);
};

exports.findById = (id, callback) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], callback);
};