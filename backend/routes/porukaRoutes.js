const express = require('express');
const router = express.Router();
const { posaljiPoruku, dohvatiPrepisku } = require('../controllers/porukaController');
const { zastiti } = require('../middleware/authMiddleware');

router.post('/', zastiti, posaljiPoruku);
router.get('/:oglasId', zastiti, dohvatiPrepisku);

module.exports = router;