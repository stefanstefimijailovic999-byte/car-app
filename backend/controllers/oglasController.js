const Oglas = require('../models/Oglas');
const asyncHandler = require('../middleware/asyncHandler');

// @route  GET /api/oglasi
// @access javno
exports.dohvatiOglase = asyncHandler(async (req, res) => {
  const { marka, gorivo, cenaMin, cenaMax, godisteMin, godisteMax, stranica = 1, sortiraj } = req.query;

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

  const opcijeSortiranja = {
    najnovije: { createdAt: -1 },
    najstarije: { createdAt: 1 },
    cenaRastuce: { cena: 1 },
    cenaOpadajuce: { cena: -1 },
    godisteNajnovije: { godiste: -1 },
    kilometrazaNajmanja: { kilometraza: 1 },
  };
  const sortOpcija = opcijeSortiranja[sortiraj] || opcijeSortiranja.najnovije;

  const limit = 20;
  const skip = (Number(stranica) - 1) * limit;

  const oglasi = await Oglas.find(filter)
    .populate('prodavac', 'ime prezime email')
    .sort(sortOpcija)
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

  const jeVlasnik = req.korisnik && oglas.prodavac._id.toString() === req.korisnik._id.toString();
  if (!jeVlasnik) {
    oglas.pregledi += 1;
    await oglas.save();
  }

  res.json(oglas);
});

// @route  GET /api/oglasi/:id/slicni
// @access javno
exports.dohvatiSlicneOglase = asyncHandler(async (req, res) => {
  const oglas = await Oglas.findById(req.params.id);

  if (!oglas) {
    return res.status(404).json({ poruka: 'Oglas nije pronađen' });
  }

  const rasponCene = oglas.cena * 0.3;

  const slicni = await Oglas.find({
    _id: { $ne: oglas._id },
    aktivno: true,
    $or: [
      { marka: oglas.marka },
      { cena: { $gte: oglas.cena - rasponCene, $lte: oglas.cena + rasponCene } }
    ]
  })
    .limit(4)
    .sort({ createdAt: -1 });

  res.json(slicni);
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

// @route  POST /api/oglasi/upload-slike
// @access privatno
exports.uploadSlike = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ poruka: 'Nijedna slika nije poslata' });
  }

  if (req.files.length > 30) {
    return res.status(400).json({ poruka: 'Maksimalno 30 slika po oglasu' });
  }

  const urlovi = req.files.map((file) => file.path);
  res.json({ slike: urlovi });
});

// @route  GET /api/oglasi/moji/lista
// @access privatno
exports.dohvatiMojeOglase = asyncHandler(async (req, res) => {
  const oglasi = await Oglas.find({ prodavac: req.korisnik._id }).sort({ createdAt: -1 });
  res.json(oglasi);
});