const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authValidation } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

router.post('/register', authValidation.register, authController.register);
router.post('/login', authValidation.login, authController.login);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
