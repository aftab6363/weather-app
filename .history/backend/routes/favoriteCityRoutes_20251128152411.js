// routes/favoriteCityRoutes.js
const express = require('express');
const router = express.Router();
const { saveCity } = require('../controllers/favoriteCityController');
const authMiddleware = require('../middleware/auth'); // your existing login auth middleware

// POST API to save a city
router.post('/favorite-cities', authMiddleware, saveCity);

module.exports = router;
