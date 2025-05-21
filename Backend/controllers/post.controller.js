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
  let query = `
    SELECT 
      p.*, 
      u.username,
      (
        SELECT COUNT(*) 
        FROM likes 
        WHERE post_id = p.id AND is_like = 1
      ) AS likes
    FROM posts p
    JOIN users u ON p.user_id = u.id
  `;
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

// Like a post
exports.likePost = (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;

  const sql = `
    INSERT INTO likes (post_id, user_id, is_like)
    VALUES (?, ?, 1)
    ON CONFLICT(post_id, user_id) DO UPDATE SET is_like = 1;
  `;

  db.run(sql, [postId, userId], function (err) {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).json({ error: 'Failed to like post' });
    }
    res.json({ success: true, message: 'Post liked' });
  });
};


// Unlike a post
exports.unlikePost = (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;

  db.run(
    'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?',
    [postId, userId],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to unlike post' });
      res.json({ success: true, message: 'Post unliked' });
    }
  );
};

// Comment on a post
exports.commentOnPost = (req, res) => {
  const { postId } = req.params;
  const userId = req.user.userId;
  const { comment } = req.body;

  if (!comment) {
    return res.status(400).json({ error: 'Comment is required' });
  }

  db.run(
    'INSERT INTO post_comments (post_id, user_id, comment) VALUES (?, ?, ?)',
    [postId, userId, comment],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to comment' });
      res.json({ success: true, message: 'Comment added' });
    }
  );
};

// Get posts by userId
exports.getPostsByUser = (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT p.*, u.username FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE u.id = ?
    ORDER BY p.created_at DESC;
  `;

  db.all(query, [userId], (err, posts) => {
    if (err) return res.status(500).json({ error: 'Failed to get posts' });
    res.json(posts);
  });
};