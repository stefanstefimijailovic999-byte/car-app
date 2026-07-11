const express = require('express');
const router = express.Router();
const {
  dohvatiKorisnike,
  obrisiKorisnika,
  deaktivirajKorisnika,
  dohvatiStatistiku
} = require('../controllers/adminController');
const { zastiti, samoAdmin } = require('../middleware/authMiddleware');

// sve admin rute zahtevaju i login i admin ulogu
router.use(zastiti, samoAdmin);

router.get('/korisnici', dohvatiKorisnike);
router.delete('/korisnici/:id', obrisiKorisnika);
router.put('/korisnici/:id/deaktiviraj', deaktivirajKorisnika);
router.get('/statistika', dohvatiStatistiku);

module.exports = router;