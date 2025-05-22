const db = require('../config/db');

exports.followUser = (req, res) => {
  const followerId = req.user.userId;
  const { followingId } = req.body;

  if (!followingId || followerId === followingId) {
    return res.status(400).json({ error: 'Invalid follow request' });
  }

  const sql = 'INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)';
  db.run(sql, [followerId, followingId], function (err) {
    if (err) {
      console.error('[Follow Error]', err);
      return res.status(500).json({ error: 'Failed to follow user' });
    }

    if (this.changes === 0) {
      return res.status(200).json({ message: 'Already following' });
    }

    res.status(200).json({ message: 'Followed successfully' });
  });
};

exports.unfollowUser = (req, res) => {
  const followerId = req.user.userId;
  const { followingId } = req.body;

  if (!followingId || followerId === followingId) {
    return res.status(400).json({ error: 'Invalid unfollow request' });
  }

  const sql = 'DELETE FROM follows WHERE follower_id = ? AND following_id = ?';
  db.run(sql, [followerId, followingId], function (err) {
    if (err) {
      console.error('[Unfollow Error]', err);
      return res.status(500).json({ error: 'Failed to unfollow user' });
    }

    if (this.changes === 0) {
      return res.status(200).json({ message: 'Not currently following' });
    }

    res.status(200).json({ message: 'Unfollowed successfully' });
  });
};

exports.getFollowing = (req, res) => {
  const userId = req.user.userId;

  const sql = `
    SELECT u.id, u.username
    FROM follows f
    JOIN users u ON f.following_id = u.id
    WHERE f.follower_id = ?
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error('[Get Following Error]', err);
      return res.status(500).json({ error: 'Failed to get following list' });
    }
    res.status(200).json(rows);
  });
};
