const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

const generisiToken = (userId, uloga) => {
  return jwt.sign({ userId, uloga }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @route  POST /api/auth/registracija
exports.registracija = asyncHandler(async (req, res) => {
  const { ime, prezime, email, lozinka } = req.body;

  const postojiKorisnik = await User.findOne({ email });
  if (postojiKorisnik) {
    return res.status(400).json({ poruka: 'Korisnik sa ovim emailom već postoji' });
  }

  const noviKorisnik = await User.create({ ime, prezime, email, lozinka });

  const token = generisiToken(noviKorisnik._id, noviKorisnik.uloga);

  res.status(201).json({
    token,
    korisnik: {
      id: noviKorisnik._id,
      ime: noviKorisnik.ime,
      prezime: noviKorisnik.prezime,
      email: noviKorisnik.email,
      uloga: noviKorisnik.uloga
    }
  });
});

// @route  POST /api/auth/prijava
exports.prijava = asyncHandler(async (req, res) => {
  const { email, lozinka } = req.body;

  const korisnik = await User.findOne({ email });
  if (!korisnik) {
    return res.status(401).json({ poruka: 'Pogrešan email ili lozinka' });
  }

  const lozinkaTacna = await korisnik.uporediLozinku(lozinka);
  if (!lozinkaTacna) {
    return res.status(401).json({ poruka: 'Pogrešan email ili lozinka' });
  }

  const token = generisiToken(korisnik._id, korisnik.uloga);

  res.json({
    token,
    korisnik: {
      id: korisnik._id,
      ime: korisnik.ime,
      prezime: korisnik.prezime,
      email: korisnik.email,
      uloga: korisnik.uloga
    }
  });
});

// @route  GET /api/auth/profil
exports.mojProfil = asyncHandler(async (req, res) => {
  res.json({ korisnik: req.korisnik });
});

// @route  POST /api/auth/omiljeni/:oglasId
// @access privatno
exports.dodajUOmiljene = asyncHandler(async (req, res) => {
  const User = require('../models/User');
  const korisnik = await User.findById(req.korisnik._id);

  if (!korisnik.omiljeni.includes(req.params.oglasId)) {
    korisnik.omiljeni.push(req.params.oglasId);
    await korisnik.save();
  }

  res.json({ omiljeni: korisnik.omiljeni });
});

// @route  DELETE /api/auth/omiljeni/:oglasId
// @access privatno
exports.ukloniIzOmiljenih = asyncHandler(async (req, res) => {
  const User = require('../models/User');
  const korisnik = await User.findById(req.korisnik._id);

  korisnik.omiljeni = korisnik.omiljeni.filter(
    (id) => id.toString() !== req.params.oglasId
  );
  await korisnik.save();

  res.json({ omiljeni: korisnik.omiljeni });
});

// @route  GET /api/auth/omiljeni
// @access privatno
exports.dohvatiOmiljene = asyncHandler(async (req, res) => {
  const User = require('../models/User');
  const korisnik = await User.findById(req.korisnik._id).populate('omiljeni');

  res.json(korisnik.omiljeni);
});