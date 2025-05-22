const express = require('express');
const router = express.Router();
const followController = require('../controllers/follow.controller');
const authMiddleware = require('../middleware/auth');
const csrfMiddleware = require('../middleware/csrf');

router.post('/follow', authMiddleware, csrfMiddleware, followController.followUser);
router.post('/unfollow', authMiddleware, csrfMiddleware, followController.unfollowUser);
router.get('/following', authMiddleware, followController.getFollowing);

module.exports = router;
