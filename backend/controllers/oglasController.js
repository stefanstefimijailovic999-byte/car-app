const Oglas = require('../models/Oglas');
const asyncHandler = require('../middleware/asyncHandler');

// @route  GET /api/oglasi
// @access javno
exports.dohvatiOglase = asyncHandler(async (req, res) => {
  const { marka, gorivo, cenaMin, cenaMax, godisteMin, godisteMax, stranica = 1 } = req.query;

  const filter = { aktivno: true };
  if (marka) filter.marka = new RegExp(marka, 'i');
  if (gorivo) filter.gorivo = gorivo;
  if (cenaMin || cenaMax) {
    filter.cena = {};
    if (cenaMin) filter.cena.$gte = Number(cenaMin);
    if (cenaMax) filter.cena.$lte = Number(cenaMax);
  }
  if (godisteMin || godisteMax) {
    filter.godiste = {};
    if (godisteMin) filter.godiste.$gte = Number(godisteMin);
    if (godisteMax) filter.godiste.$lte = Number(godisteMax);
  }

  const limit = 20;
  const skip = (Number(stranica) - 1) * limit;

  const oglasi = await Oglas.find(filter)
    .populate('prodavac', 'ime prezime email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const ukupno = await Oglas.countDocuments(filter);

  res.json({
    oglasi,
    ukupno,
    stranica: Number(stranica),
    ukupnoStranica: Math.ceil(ukupno / limit)
  });
});

// @route  GET /api/oglasi/:id
// @access javno
exports.dohvatiOglas = asyncHandler(async (req, res) => {
  const oglas = await Oglas.findById(req.params.id).populate('prodavac', 'ime prezime email');

  if (!oglas) {
    return res.status(404).json({ poruka: 'Oglas nije pronađen' });
  }

  res.json(oglas);
});

// @route  POST /api/oglasi
// @access privatno (ulogovan korisnik)
exports.kreirajOglas = asyncHandler(async (req, res) => {
  const noviOglas = await Oglas.create({
    ...req.body,
    prodavac: req.korisnik._id
  });

  res.status(201).json(noviOglas);
});

// @route  PUT /api/oglasi/:id
// @access privatno (samo vlasnik ili admin)
exports.izmeniOglas = asyncHandler(async (req, res) => {
  const oglas = await Oglas.findById(req.params.id);

  if (!oglas) {
    return res.status(404).json({ poruka: 'Oglas nije pronađen' });
  }

  const jeVlasnik = oglas.prodavac.toString() === req.korisnik._id.toString();
  const jeAdmin = req.korisnik.uloga === 'admin';

  if (!jeVlasnik && !jeAdmin) {
    return res.status(403).json({ poruka: 'Nemate ovlašćenje da izmenite ovaj oglas' });
  }

  const azuriranOglas = await Oglas.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.json(azuriranOglas);
});

// @route  DELETE /api/oglasi/:id
// @access privatno (samo vlasnik ili admin)
exports.obrisiOglas = asyncHandler(async (req, res) => {
  const oglas = await Oglas.findById(req.params.id);

  if (!oglas) {
    return res.status(404).json({ poruka: 'Oglas nije pronađen' });
  }

  const jeVlasnik = oglas.prodavac.toString() === req.korisnik._id.toString();
  const jeAdmin = req.korisnik.uloga === 'admin';

  if (!jeVlasnik && !jeAdmin) {
    return res.status(403).json({ poruka: 'Nemate ovlašćenje da obrišete ovaj oglas' });
  }

  await oglas.deleteOne();

  res.json({ poruka: 'Oglas uspešno obrisan' });
});