const express = require('express');
const router = express.Router();
const {
  dohvatiOglase,
  dohvatiOglas,
  dohvatiSlicneOglase,
  kreirajOglas,
  izmeniOglas,
  obrisiOglas,
  uploadSlike,
  dohvatiMojeOglase
} = require('../controllers/oglasController');
const { zastiti, opcionalnoPrijavljen } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/moji/lista', zastiti, dohvatiMojeOglase);
router.get('/', dohvatiOglase);
router.get('/:id/slicni', dohvatiSlicneOglase);
router.get('/:id', opcionalnoPrijavljen, dohvatiOglas);
router.post('/', zastiti, kreirajOglas);
router.post('/upload-slike', zastiti, upload.array('slike', 30), uploadSlike);
router.put('/:id', zastiti, izmeniOglas);
router.delete('/:id', zastiti, obrisiOglas);

module.exports = router;