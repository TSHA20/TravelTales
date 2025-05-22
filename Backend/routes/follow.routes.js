const express = require('express');
const router = express.Router();
const followController = require('../controllers/follow.controller');
const authMiddleware = require('../middleware/auth');

router.post('/follow', authMiddleware, followController.followUser);
router.post('/unfollow', authMiddleware, followController.unfollowUser);
router.get('/following', authMiddleware, followController.getFollowing);

module.exports = router;
