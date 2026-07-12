const Ocena = require('../models/Ocena');
const asyncHandler = require('../middleware/asyncHandler');

// @route  POST /api/ocene
// @access privatno
exports.ostaviOcenu = asyncHandler(async (req, res) => {
  const { ocenjeniId, ocena, komentar } = req.body;

  if (ocenjeniId === req.korisnik._id.toString()) {
    return res.status(400).json({ poruka: 'Ne možete oceniti sami sebe' });
  }

  if (!ocena || ocena < 1 || ocena > 5) {
    return res.status(400).json({ poruka: 'Ocena mora biti između 1 i 5' });
  }

  // upsert: ako autor već ima ocenu za tog korisnika, ažurira je umesto da pravi duplikat
  const nova = await Ocena.findOneAndUpdate(
    { ocenjeni: ocenjeniId, autor: req.korisnik._id },
    { ocena, komentar: komentar || '' },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(201).json(nova);
});

// @route  GET /api/ocene/:korisnikId
// @access javno
exports.dohvatiOceneKorisnika = asyncHandler(async (req, res) => {
  const ocene = await Ocena.find({ ocenjeni: req.params.korisnikId })
    .populate('autor', 'ime prezime')
    .sort({ createdAt: -1 });

  const prosek = ocene.length > 0
    ? ocene.reduce((zbir, o) => zbir + o.ocena, 0) / ocene.length
    : 0;

  res.json({
    ocene,
    prosek: Math.round(prosek * 10) / 10,
    broj: ocene.length
  });
});

// @route  GET /api/ocene/:korisnikId/moja
// @access privatno — moja postojeća ocena za tog korisnika (da se forma prefilluje)
exports.dohvatiMojuOcenu = asyncHandler(async (req, res) => {
  const ocena = await Ocena.findOne({
    ocenjeni: req.params.korisnikId,
    autor: req.korisnik._id
  });

  res.json(ocena || null);
});

module.exports = exports;