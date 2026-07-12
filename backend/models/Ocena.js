const mongoose = require('mongoose');

const ocenaSchema = new mongoose.Schema({
  ocenjeni: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  autor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ocena: {
    type: Number,
    required: [true, 'Ocena je obavezna'],
    min: 1,
    max: 5
  },
  komentar: {
    type: String,
    default: '',
    trim: true
  }
}, {
  timestamps: true
});

// Jedan autor može imati samo jednu ocenu po korisniku — ponovno slanje ažurira postojeću
ocenaSchema.index({ ocenjeni: 1, autor: 1 }, { unique: true });

module.exports = mongoose.model('Ocena', ocenaSchema);