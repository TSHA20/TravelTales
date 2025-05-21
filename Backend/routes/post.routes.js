const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, postController.createPost);
router.get('/', postController.getPosts);
router.put('/:id', authMiddleware, postController.updatePost);
router.delete('/:id', authMiddleware, postController.deletePost);

router.post('/like/:postId', authMiddleware, postController.likePost);
router.post('/unlike/:postId', authMiddleware, postController.unlikePost);
router.post('/comment/:postId', authMiddleware, postController.commentOnPost);
router.get('/user/:userId', postController.getPostsByUser);

module.exports = router;