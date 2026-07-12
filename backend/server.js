const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Car App API radi!' });
});

const authRoutes = require('./routes/authRoutes');
const oglasRoutes = require('./routes/oglasRoutes');
const porukaRoutes = require('./routes/porukaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ocenaRoutes = require('./routes/ocenaRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/oglasi', oglasRoutes);
app.use('/api/poruke', porukaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ocene', ocenaRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Konektovan na MongoDB'))
  .catch((err) => console.error('Greška pri konekciji na MongoDB:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server radi na portu ${PORT}`);
});