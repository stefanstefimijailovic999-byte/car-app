const mongoose = require('mongoose');

const oglasSchema = new mongoose.Schema({
  naslov: { type: String, required: [true, 'Naslov je obavezan'], trim: true },
  marka: { type: String, required: [true, 'Marka je obavezna'] },
  model: { type: String, required: [true, 'Model je obavezan'] },
  godiste: { type: Number, required: [true, 'Godište je obavezno'] },
  kilometraza: { type: Number, required: [true, 'Kilometraža je obavezna'] },
  gorivo: {
    type: String,
    enum: ['benzin', 'dizel', 'hibrid', 'elektricni'],
    required: [true, 'Vrsta goriva je obavezna']
  },
  cena: { type: Number, required: [true, 'Cena je obavezna'] },
  opis: { type: String, default: '' },
  slike: {
    type: [String],
    default: [],
    validate: {
      validator: (arr) => arr.length <= 30,
      message: 'Maksimalan broj slika je 30'
    }
  },
  lokacija: { type: String, default: '' },
  prodavac: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  aktivno: { type: Boolean, default: true },
  pregledi: { type: Number, default: 0 },

  statusVlasnistva: {
    type: String,
    enum: ['vlasnik', 'lizing', 'kredit'],
    default: 'vlasnik'
  },
  pogon: {
    type: String,
    enum: ['prednji', 'zadnji', '4x4']
  },
  snaga: { type: Number },
  obrtniMomenat: { type: Number },
  brojVrata: { type: Number },
  brojSedista: { type: Number },
  bojaEnterijera: { type: String },
  menjac: {
    type: String,
    enum: ['manuelni', 'automatski', 'poluautomatski']
  },
  statusRegistracije: {
    type: String,
    enum: ['registrovan', 'neregistrovan', 'istekla_registracija']
  },
  ostecen: { type: Boolean, default: false },
  bioUNezgodi: { type: Boolean, default: false },
  brojVlasnika: { type: Number },
  telefonOglasivaca: { type: String },
  zapreminaPrtljaznika: { type: Number },
  zapreminaMotora: { type: Number },
  velicinaRezervoara: { type: Number },
  dodatnaOprema: { type: [String], default: [] }
}, {
  timestamps: true
});

module.exports = mongoose.model('Oglas', oglasSchema);