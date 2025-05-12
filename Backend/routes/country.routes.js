const express = require('express');
const router = express.Router();
const countryController = require('../controllers/country.controller');

router.get('/', countryController.getCountries);
router.get('/:name', countryController.getCountryDetails);

module.exports = router;