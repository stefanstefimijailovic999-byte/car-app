const express = require('express');
const router = express.Router();
const { registracija, prijava, mojProfil } = require('../controllers/authController');
const { zastiti } = require('../middleware/authMiddleware');

router.post('/registracija', registracija);
router.post('/prijava', prijava);
router.get('/profil', zastiti, mojProfil);

module.exports = router;