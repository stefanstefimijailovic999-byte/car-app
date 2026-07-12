const express = require('express');
const router = express.Router();
const {
  posaljiPoruku,
  dohvatiPrepisku,
  dohvatiRazgovore,
  dohvatiBrojNeprocitanih,
  oznaciProcitano
} = require('../controllers/porukaController');
const { zastiti } = require('../middleware/authMiddleware');

// Bitno: specifične rute (nepr/broj) moraju biti IZNAD /:oglasId,
// inače bi Express pokušao da "nepr" protumači kao ID.
router.get('/', zastiti, dohvatiRazgovore);
router.get('/nepr/broj', zastiti, dohvatiBrojNeprocitanih);
router.post('/', zastiti, posaljiPoruku);
router.put('/:oglasId/procitano', zastiti, oznaciProcitano);
router.get('/:oglasId', zastiti, dohvatiPrepisku);

module.exports = router;