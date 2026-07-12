const express = require('express');
const router = express.Router();
const { ostaviOcenu, dohvatiOceneKorisnika, dohvatiMojuOcenu } = require('../controllers/ocenaController');
const { zastiti } = require('../middleware/authMiddleware');

router.post('/', zastiti, ostaviOcenu);
router.get('/:korisnikId/moja', zastiti, dohvatiMojuOcenu);
router.get('/:korisnikId', dohvatiOceneKorisnika);

module.exports = router;