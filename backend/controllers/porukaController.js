const Poruka = require('../models/Poruka');
const Oglas = require('../models/Oglas');
const asyncHandler = require('../middleware/asyncHandler');

// @route  POST /api/poruke
// @access privatno
exports.posaljiPoruku = asyncHandler(async (req, res) => {
  const { oglasId, tekst, primalacId } = req.body;

  const oglas = await Oglas.findById(oglasId);
  if (!oglas) {
    return res.status(404).json({ poruka: 'Oglas nije pronađen' });
  }

  const stvarniPrimalac = primalacId || oglas.prodavac;

  if (stvarniPrimalac.toString() === req.korisnik._id.toString()) {
    return res.status(400).json({ poruka: 'Ne možete slati poruku samom sebi' });
  }

  const novaPoruka = await Poruka.create({
    oglas: oglasId,
    posiljalac: req.korisnik._id,
    primalac: stvarniPrimalac,
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

// @route  GET /api/poruke
// @access privatno — lista svih razgovora (poslednja poruka iz svakog + da li ima nepročitanih)
exports.dohvatiRazgovore = asyncHandler(async (req, res) => {
  const korisnikId = req.korisnik._id;

  const poruke = await Poruka.find({
    $or: [{ posiljalac: korisnikId }, { primalac: korisnikId }]
  })
    .populate('oglas', 'naslov slike')
    .populate('posiljalac', 'ime prezime')
    .populate('primalac', 'ime prezime')
    .sort({ createdAt: -1 });

  const razgovoriMap = new Map();
  const neprocitaniKljucevi = new Set();

  for (const p of poruke) {
    const jaSamPrimalac = p.primalac._id.toString() === korisnikId.toString();
    const sagovornikId = jaSamPrimalac
      ? p.posiljalac._id.toString()
      : p.primalac._id.toString();

    const kljuc = `${p.oglas._id}_${sagovornikId}`;

    if (jaSamPrimalac && !p.procitano) {
      neprocitaniKljucevi.add(kljuc);
    }

    if (!razgovoriMap.has(kljuc)) {
      const sagovornik = jaSamPrimalac ? p.posiljalac : p.primalac;
      razgovoriMap.set(kljuc, {
        oglas: p.oglas,
        sagovornik,
        poslednjaPoruka: p.tekst,
        vreme: p.createdAt
      });
    }
  }

  const razgovori = Array.from(razgovoriMap.entries()).map(([kljuc, r]) => ({
    ...r,
    neprocitano: neprocitaniKljucevi.has(kljuc)
  }));

  res.json(razgovori);
});

// @route  GET /api/poruke/nepr/broj
// @access privatno — ukupan broj nepročitanih poruka (za bedž u Navbar-u)
exports.dohvatiBrojNeprocitanih = asyncHandler(async (req, res) => {
  const broj = await Poruka.countDocuments({
    primalac: req.korisnik._id,
    procitano: false
  });
  res.json({ broj });
});

// @route  PUT /api/poruke/:oglasId/procitano
// @access privatno — označava sve poruke iz tog razgovora kao pročitane
exports.oznaciProcitano = asyncHandler(async (req, res) => {
  const { oglasId } = req.params;

  await Poruka.updateMany(
    { oglas: oglasId, primalac: req.korisnik._id, procitano: false },
    { procitano: true }
  );

  res.json({ poruka: 'Označeno kao pročitano' });
});