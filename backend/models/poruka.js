const mongoose = require('mongoose');

const porukaSchema = new mongoose.Schema({
  oglas: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Oglas',
    required: true
  },
  posiljalac: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  primalac: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tekst: {
    type: String,
    required: [true, 'Tekst poruke je obavezan'],
    trim: true
  },
  procitano: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Poruka', porukaSchema);