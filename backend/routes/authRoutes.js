const express = require('express');
const router = express.Router();
const {
  registracija,
  prijava,
  mojProfil,
  dodajUOmiljene,
  ukloniIzOmiljenih,
  dohvatiOmiljene
} = require('../controllers/authController');
const { zastiti } = require('../middleware/authMiddleware');

router.post('/registracija', registracija);
router.post('/prijava', prijava);
router.get('/profil', zastiti, mojProfil);
router.get('/omiljeni', zastiti, dohvatiOmiljene);
router.post('/omiljeni/:oglasId', zastiti, dodajUOmiljene);
router.delete('/omiljeni/:oglasId', zastiti, ukloniIzOmiljenih);

module.exports = router;