const express = require('express');

const professionalController = require('../controllers/professional');

const router = express.Router();

// GET /feed/posts
router.get('/', professionalController.getData);

router.post('/', professionalController.createData);

// localhost:8080/professional/
module.exports = router;