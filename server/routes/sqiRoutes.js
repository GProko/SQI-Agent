
const express = require('express');
const router = express.Router();
const sqiController = require('../controllers/sqiController');
const validateSQIRequest = require('../middleware/validateRequest');

//compute-sqi
router.post('/compute-sqi', validateSQIRequest, sqiController.computeSQI);

module.exports = router;