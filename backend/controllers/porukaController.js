const Poruka = require('../models/Poruka');
const Oglas = require('../models/Oglas');
const asyncHandler = require('../middleware/asyncHandler');

// @route  POST /api/poruke
// @access privatno
exports.posaljiPoruku = asyncHandler(async (req, res) => {
  const { oglasId, tekst } = req.body;

  const oglas = await Oglas.findById(oglasId);
  if (!oglas) {
    return res.status(404).json({ poruka: 'Oglas nije pronađen' });
  }

  if (oglas.prodavac.toString() === req.korisnik._id.toString()) {
    return res.status(400).json({ poruka: 'Ne možete slati poruku samom sebi' });
  }

  const novaPoruka = await Poruka.create({
    oglas: oglasId,
    posiljalac: req.korisnik._id,
    primalac: oglas.prodavac,
    tekst
  });

  res.status(201).json(novaPoruka);
});

// @route  GET /api/poruke/:oglasId
// @access privatno (samo učesnici prepiske)
exports.dohvatiPrepisku = asyncHandler(async (req, res) => {
  const { oglasId } = req.params;

  const poruke = await Poruka.find({
    oglas: oglasId,
    $or: [
      { posiljalac: req.korisnik._id },
      { primalac: req.korisnik._id }
    ]
  })
    .populate('posiljalac', 'ime prezime')
    .populate('primalac', 'ime prezime')
    .sort({ createdAt: 1 });

  res.json(poruke);
});