const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
const authMiddleware = require('../middleware/auth.js');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authMiddleware, userController.getProfile);
router.get('/me', authMiddleware, userController.getCurrentUser);

module.exports = router;