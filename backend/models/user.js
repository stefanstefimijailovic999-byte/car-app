const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  ime: {
    type: String,
    required: [true, 'Ime je obavezno']
  },
  prezime: {
    type: String,
    required: [true, 'Prezime je obavezno']
  },
  email: {
    type: String,
    required: [true, 'Email je obavezan'],
    unique: true,
    lowercase: true,
    trim: true
  },
  lozinka: {
    type: String,
    required: [true, 'Lozinka je obavezna'],
    minlength: 6
  },
  uloga: {
    type: String,
    enum: ['korisnik', 'admin'],
    default: 'korisnik'
  },
  aktivan: {
    type: Boolean,
    default: true
  },
  omiljeni: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Oglas'
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function() {
  if (!this.isModified('lozinka')) return;
  this.lozinka = await bcrypt.hash(this.lozinka, 12);
});

userSchema.methods.uporediLozinku = async function(unetaLozinka) {
  return await bcrypt.compare(unetaLozinka, this.lozinka);
};

module.exports = mongoose.model('User', userSchema);