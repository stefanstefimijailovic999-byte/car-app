const mongoose = require('mongoose');

const oglasSchema = new mongoose.Schema({
  naslov: {
    type: String,
    required: [true, 'Naslov je obavezan'],
    trim: true
  },
  marka: {
    type: String,
    required: [true, 'Marka je obavezna']
  },
  model: {
    type: String,
    required: [true, 'Model je obavezan']
  },
  godiste: {
    type: Number,
    required: [true, 'Godište je obavezno']
  },
  kilometraza: {
    type: Number,
    required: [true, 'Kilometraža je obavezna']
  },
  gorivo: {
    type: String,
    enum: ['benzin', 'dizel', 'hibrid', 'elektricni'],
    required: [true, 'Vrsta goriva je obavezna']
  },
  cena: {
    type: Number,
    required: [true, 'Cena je obavezna']
  },
  opis: {
    type: String,
    default: ''
  },
  slike: {
    type: [String],
    default: []
  },
  lokacija: {
    type: String,
    default: ''
  },
  prodavac: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  aktivno: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Oglas', oglasSchema);