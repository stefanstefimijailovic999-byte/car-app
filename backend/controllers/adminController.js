const User = require('../models/User');
const Oglas = require('../models/Oglas');
const asyncHandler = require('../middleware/asyncHandler');

// @route  GET /api/admin/korisnici
exports.dohvatiKorisnike = asyncHandler(async (req, res) => {
  const korisnici = await User.find().select('-lozinka').sort({ createdAt: -1 });
  res.json(korisnici);
});

// @route  DELETE /api/admin/korisnici/:id
exports.obrisiKorisnika = asyncHandler(async (req, res) => {
  const korisnik = await User.findById(req.params.id);
  if (!korisnik) {
    return res.status(404).json({ poruka: 'Korisnik nije pronađen' });
  }
  await korisnik.deleteOne();
  res.json({ poruka: 'Korisnik uspešno obrisan' });
});

// @route  PUT /api/admin/korisnici/:id/deaktiviraj
exports.deaktivirajKorisnika = asyncHandler(async (req, res) => {
  const korisnik = await User.findByIdAndUpdate(
    req.params.id,
    { aktivan: false },
    { new: true }
  ).select('-lozinka');

  if (!korisnik) {
    return res.status(404).json({ poruka: 'Korisnik nije pronađen' });
  }

  res.json(korisnik);
});

// @route  GET /api/admin/statistika
exports.dohvatiStatistiku = asyncHandler(async (req, res) => {
  const brojKorisnika = await User.countDocuments();
  const brojOglasa = await Oglas.countDocuments();
  const brojAktivnihOglasa = await Oglas.countDocuments({ aktivno: true });

  const pre24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const novihKorisnika24h = await User.countDocuments({ createdAt: { $gte: pre24h } });

  res.json({
    brojKorisnika,
    brojOglasa,
    brojAktivnihOglasa,
    novihKorisnika24h
  });
});