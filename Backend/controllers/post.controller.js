const db = require('../config/db');

exports.createPost = (req, res) => {
  const { title, content, country_name, visit_date } = req.body;
  const userId = req.user.userId;
  db.run(
    'INSERT INTO posts (user_id, title, content, country_name, visit_date) VALUES (?, ?, ?, ?, ?)',
    [userId, title, content, country_name, visit_date],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Invalid post data' });
      }
      res.status(201).json({ message: 'Post created', postId: this.lastID });
    }
  );
};

exports.getPosts = (req, res) => {
  const { country, username } = req.query;
  let query = 'SELECT p.*, u.username FROM posts p JOIN users u ON p.user_id = u.id';
  const params = [];
  if (country) {
    query += ' WHERE p.country_name = ?';
    params.push(country);
  } else if (username) {
    query += ' WHERE u.username = ?';
    params.push(username);
  }
  query += ' ORDER BY p.created_at DESC';
  db.all(query, params, (err, posts) => {
    if (err) {
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(posts);
  });
};

exports.updatePost = (req, res) => {
  const { title, content, country_name, visit_date } = req.body;
  const postId = req.params.id;
  const userId = req.user.userId;
  db.run(
    'UPDATE posts SET title = ?, content = ?, country_name = ?, visit_date = ? WHERE id = ? AND user_id = ?',
    [title, content, country_name, visit_date, postId, userId],
    function (err) {
      if (err || this.changes === 0) {
        return res.status(403).json({ error: 'Unauthorized or post not found' });
      }
      res.json({ message: 'Post updated' });
    }
  );
};

exports.deletePost = (req, res) => {
  const postId = req.params.id;
  const userId = req.user.userId;
  db.run('DELETE FROM posts WHERE id = ? AND user_id = ?', [postId, userId], function (err) {
    if (err || this.changes === 0) {
      return res.status(403).json({ error: 'Unauthorized or post not found' });
    }
    res.json({ message: 'Post deleted' });
  });
};