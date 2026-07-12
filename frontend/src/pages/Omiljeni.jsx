import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import OglasCard from '../components/OglasCard';
import api from '../services/api';

function Omiljeni() {
  const [oglasi, setOglasi] = useState([]);
  const [ucitavanje, setUcitavanje] = useState(true);

  useEffect(() => {
    api.get('/auth/omiljeni')
      .then((res) => setOglasi(res.data))
      .finally(() => setUcitavanje(false));
  }, []);

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-bold mb-6">Omiljeni oglasi</h1>

        {ucitavanje ? (
          <p className="text-text-muted">Učitavanje...</p>
        ) : oglasi.length === 0 ? (
          <div className="text-center py-16 border border-white/5 rounded-2xl">
            <p className="text-text-muted mb-1">Nemate sačuvanih oglasa.</p>
            <p className="text-text-muted text-sm">Klikni na ♡ na bilo kom oglasu da ga sačuvaš ovde.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {oglasi.map((oglas) => (
              <OglasCard key={oglas._id} oglas={oglas} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Omiljeni;