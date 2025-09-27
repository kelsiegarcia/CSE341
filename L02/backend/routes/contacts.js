const express = require('express');

const contactController = require('../controllers/contact');

const router = express.Router();

router.get('/', contactController.getData);

router.post('/', contactController.createData);

module.exports = router;