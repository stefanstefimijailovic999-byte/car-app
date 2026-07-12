import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

function AdminPanel() {
  const [tab, setTab] = useState('statistika');
  const [statistika, setStatistika] = useState(null);
  const [korisnici, setKorisnici] = useState([]);
  const [ucitavanje, setUcitavanje] = useState(true);

  useEffect(() => {
    if (tab === 'statistika') {
      setUcitavanje(true);
      api.get('/admin/statistika')
        .then((res) => setStatistika(res.data))
        .finally(() => setUcitavanje(false));
    } else if (tab === 'korisnici') {
      setUcitavanje(true);
      api.get('/admin/korisnici')
        .then((res) => setKorisnici(res.data))
        .finally(() => setUcitavanje(false));
    }
  }, [tab]);

  const obrisiKorisnika = async (id) => {
    if (!window.confirm('Obrisati ovaj nalog trajno?')) return;
    try {
      await api.delete(`/admin/korisnici/${id}`);
      setKorisnici(korisnici.filter((k) => k._id !== id));
    } catch (err) {
      alert(err.response?.data?.poruka || 'Greška pri brisanju.');
    }
  };

  const deaktivirajKorisnika = async (id) => {
    try {
      const res = await api.put(`/admin/korisnici/${id}/deaktiviraj`);
      setKorisnici(korisnici.map((k) => (k._id === id ? res.data : k)));
    } catch (err) {
      alert(err.response?.data?.poruka || 'Greška.');
    }
  };

  const tabKlasa = (aktivan) =>
    `px-4 py-2 text-sm rounded-lg transition ${
      aktivan ? 'bg-gradient-to-r from-primary to-secondary text-background font-bold' : 'text-text-muted hover:text-primary'
    }`;

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-bold mb-6">Admin panel</h1>

        <div className="flex gap-2 mb-8 border-b border-white/10 pb-4">
          <button onClick={() => setTab('statistika')} className={tabKlasa(tab === 'statistika')}>
            Statistika
          </button>
          <button onClick={() => setTab('korisnici')} className={tabKlasa(tab === 'korisnici')}>
            Korisnici
          </button>
        </div>

        {ucitavanje ? (
          <p className="text-text-muted">Učitavanje...</p>
        ) : tab === 'statistika' && statistika ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ['Ukupno korisnika', statistika.brojKorisnika],
              ['Ukupno oglasa', statistika.brojOglasa],
              ['Aktivnih oglasa', statistika.brojAktivnihOglasa],
              ['Novih korisnika (24h)', statistika.novihKorisnika24h],
            ].map(([label, val]) => (
              <div key={label} className="bg-white/[0.03] border border-primary/15 rounded-2xl p-5">
                <p className="text-text-muted text-xs mb-2">{label}</p>
                <p className="font-display font-bold text-3xl text-primary">{val}</p>
              </div>
            ))}
          </div>
        ) : tab === 'korisnici' ? (
          <div className="space-y-2">
            {korisnici.map((k) => (
              <div
                key={k._id}
                className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-xl p-4"
              >
                <div>
                  <p className="font-medium text-sm">
                    {k.ime} {k.prezime}{' '}
                    {k.uloga === 'admin' && (
                      <span className="text-primary text-xs ml-1">(admin)</span>
                    )}
                    {!k.aktivan && (
                      <span className="text-red-400 text-xs ml-1">(deaktiviran)</span>
                    )}
                  </p>
                  <p className="text-text-muted text-xs">{k.email}</p>
                </div>

                <div className="flex items-center gap-3">
                  {k.aktivan && k.uloga !== 'admin' && (
                    <button
                      onClick={() => deaktivirajKorisnika(k._id)}
                      className="text-text-muted text-sm hover:text-primary"
                    >
                      Deaktiviraj
                    </button>
                  )}
                  {k.uloga !== 'admin' && (
                    <button
                      onClick={() => obrisiKorisnika(k._id)}
                      className="text-red-400 text-sm hover:underline"
                    >
                      Obriši
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default AdminPanel;