const express = require('express');
const { handleQuestion } = require('../controllers/aiController');
const router = express.Router();

router.post('/ask', handleQuestion);

module.exports = router;
