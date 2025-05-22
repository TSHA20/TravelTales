const db = require('../config/db');

exports.followUser = (req, res) => {
    const followerId = req.user.userId;
    const { followingId } = req.body;
  
    if (!followingId || followerId === followingId) {
      return res.status(400).json({ error: 'Invalid follow request' });
    }
  
    db.run(
      'INSERT OR IGNORE INTO follows (follower_id, following_id) VALUES (?, ?)',
      [followerId, followingId],
      (err) => {
        if (err) {
          console.error('[Follow Error]', err);
          return res.status(500).json({ error: 'Failed to follow' });
        }
        res.json({ message: 'Followed successfully' });
      }
    );
  };

exports.unfollowUser = (req, res) => {
  const followerId = req.user.userId;
  const { followingId } = req.body;

  db.run(
    'DELETE FROM follows WHERE follower_id = ? AND following_id = ?',
    [followerId, followingId],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to unfollow' });
      res.json({ message: 'Unfollowed successfully' });
    }
  );
};

exports.getFollowing = (req, res) => {
  const userId = req.user.userId;

  db.all(
    `SELECT u.id, u.username FROM follows f 
     JOIN users u ON f.following_id = u.id 
     WHERE f.follower_id = ?`,
    [userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'Failed to get following list' });
      res.json(rows);
    }
  );
};
