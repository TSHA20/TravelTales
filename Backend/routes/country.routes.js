const express = require('express');
const router = express.Router();
const countryController = require('../controllers/country.controller');

// Import JWT + CSRF middlewares
const authMiddleware = require('../middleware/auth');
const csrfMiddleware = require('../middleware/csrf');

// Apply both middlewares to all country routes
router.get('/', authMiddleware, csrfMiddleware, countryController.getCountries);
router.get('/:name', authMiddleware, csrfMiddleware, countryController.getCountryDetails);

module.exports = router;
