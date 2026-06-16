const express = require('express');
const router = express.Router();
const { getAllItems, getByCategory } = require('../controllers/menuController');

router.get('/', getAllItems);
router.get('/:category', getByCategory);

module.exports = router;
