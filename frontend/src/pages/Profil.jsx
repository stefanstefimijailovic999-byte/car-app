import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Profil() {
  const { korisnik } = useAuth();
  const [mojiOglasi, setMojiOglasi] = useState([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [brisanje, setBrisanje] = useState(null);

  useEffect(() => {
    api.get('/oglasi/moji/lista')
      .then((res) => setMojiOglasi(res.data))
      .catch((err) => console.error('Greška pri učitavanju oglasa:', err))
      .finally(() => setUcitavanje(false));
  }, []);

  const obrisiOglas = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovaj oglas?')) return;

    setBrisanje(id);
    try {
      await api.delete(`/oglasi/${id}`);
      setMojiOglasi(mojiOglasi.filter((o) => o._id !== id));
    } catch (err) {
      alert(err.response?.data?.poruka || 'Greška pri brisanju oglasa.');
    } finally {
      setBrisanje(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white/[0.03] border border-primary/15 rounded-2xl p-6 mb-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center font-display font-bold text-background text-lg">
            {korisnik?.ime?.[0]}{korisnik?.prezime?.[0]}
          </div>
          <div>
            <p className="font-medium">{korisnik?.ime} {korisnik?.prezime}</p>
            <p className="text-text-muted text-sm">{korisnik?.email}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-5">
          <h2 className="font-display text-xl font-medium">Moji oglasi</h2>
          <Link
            to="/dodaj-oglas"
            className="bg-gradient-to-r from-primary to-secondary text-background font-bold text-sm px-5 py-2 rounded-lg"
          >
            + Dodaj oglas
          </Link>
        </div>

        {ucitavanje ? (
          <p className="text-text-muted">Učitavanje...</p>
        ) : mojiOglasi.length === 0 ? (
          <div className="text-center py-16 border border-white/5 rounded-2xl">
            <p className="text-text-muted mb-1">Još uvek nemate objavljenih oglasa.</p>
            <p className="text-text-muted text-sm">Klikni "Dodaj oglas" da objaviš svoj prvi.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {mojiOglasi.map((oglas) => (
              <div
                key={oglas._id}
                className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-background-light flex-shrink-0">
                    {oglas.slike?.[0] && (
                      <img src={oglas.slike[0]} alt={oglas.naslov} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{oglas.naslov}</p>
                    <p className="text-text-muted text-xs">
                      {oglas.cena.toLocaleString()} € · {oglas.aktivno ? 'Aktivan' : 'Neaktivan'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link to={`/oglasi/${oglas._id}`} className="text-primary text-sm hover:underline">
                    Pregled
                  </Link>
                  <Link to={`/oglasi/${oglas._id}`} className="text-primary text-sm hover:underline">
                    Pregled
                  </Link>
                  <Link to={`/oglasi/${oglas._id}/izmeni`} className="text-text-muted text-sm hover:text-primary hover:underline">
                    Izmeni
                  </Link>
                  <button
                    onClick={() => obrisiOglas(oglas._id)}
                    disabled={brisanje === oglas._id}
                    className="text-red-400 text-sm hover:underline disabled:opacity-50"
                  >
                    {brisanje === oglas._id ? 'Brisanje...' : 'Obriši'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profil;