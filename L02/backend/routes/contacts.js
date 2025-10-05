const express = require('express');

const contactController = require('../controllers/contact');

const router = express.Router();

router.get('/', contactController.getData);

router.post('/', contactController.createData);

router.get('/:id', (req, res, next) => {
console.log('[GET] id param =', req.params.id, 'length:', req.params.id?.length);
  next();
}, contactController.getById);

router.put('/:id', (req, res, next) => {
console.log('[PUT] id param =', req.params.id, 'length:', req.params.id?.length);
  next();
}, contactController.updateData);

router.delete('/:id', contactController.deleteData);

module.exports = router;