const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

// Proverava da li je korisnik ulogovan (validan JWT token)
exports.zastiti = asyncHandler(async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ poruka: 'Niste ulogovani, pristup odbijen' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const korisnik = await User.findById(decoded.userId).select('-lozinka');
    if (!korisnik) {
      return res.status(401).json({ poruka: 'Korisnik više ne postoji' });
    }

    if (!korisnik.aktivan) {
      return res.status(401).json({ poruka: 'Nalog je deaktiviran' });
    }

    req.korisnik = korisnik;
    next();
  } catch (err) {
    return res.status(401).json({ poruka: 'Nevažeći token' });
  }
});

// Proverava da li ulogovani korisnik ima admin ulogu
exports.samoAdmin = (req, res, next) => {
  if (req.korisnik.uloga !== 'admin') {
    return res.status(403).json({ poruka: 'Nemate ovlašćenje za ovu akciju' });
  }
  next();
};

// Pokušava da pročita korisnika iz tokena AKO postoji, ali ne blokira zahtev ako ga nema.
// Koristi se za javne rute kojima ipak koristi da znaju ko gleda (npr. brojanje pregleda).
exports.opcionalnoPrijavljen = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    req.korisnik = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const korisnik = await User.findById(decoded.userId).select('-lozinka');
    req.korisnik = korisnik || null;
  } catch (err) {
    req.korisnik = null;
  }

  next();
};