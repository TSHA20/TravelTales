const db = require('../config/db');

exports.findById = (id, callback) => {
  db.get('SELECT * FROM posts WHERE id = ?', [id], callback);
};

exports.findByUserId = (userId, callback) => {
  db.all('SELECT * FROM posts WHERE user_id = ?', [userId], callback);
};