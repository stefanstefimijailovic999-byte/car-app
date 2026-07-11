const express = require('express');
const router = express.Router();
const {
  dohvatiOglase,
  dohvatiOglas,
  kreirajOglas,
  izmeniOglas,
  obrisiOglas
} = require('../controllers/oglasController');
const { zastiti } = require('../middleware/authMiddleware');

router.get('/', dohvatiOglase);
router.get('/:id', dohvatiOglas);
router.post('/', zastiti, kreirajOglas);
router.put('/:id', zastiti, izmeniOglas);
router.delete('/:id', zastiti, obrisiOglas);

module.exports = router;