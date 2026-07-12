import { useEffect, useState } from 'react';
import { Zvezdice } from './OcenaProdavca';
import api from '../services/api';

function FormaOcene({ korisnikId, imeKorisnika }) {
  const [ocena, setOcena] = useState(0);
  const [hoverOcena, setHoverOcena] = useState(0);
  const [komentar, setKomentar] = useState('');
  const [salje, setSalje] = useState(false);
  const [poslato, setPoslato] = useState(false);

  useEffect(() => {
    setPoslato(false);
    setOcena(0);
    setKomentar('');

    api.get(`/ocene/${korisnikId}/moja`)
      .then((res) => {
        if (res.data) {
          setOcena(res.data.ocena);
          setKomentar(res.data.komentar || '');
        }
      })
      .catch(() => {});
  }, [korisnikId]);

  const posalji = async () => {
    if (ocena === 0) return;
    setSalje(true);
    try {
      await api.post('/ocene', { ocenjeniId: korisnikId, ocena, komentar });
      setPoslato(true);
    } catch (err) {
      alert(err.response?.data?.poruka || 'Greška pri slanju ocene.');
    } finally {
      setSalje(false);
    }
  };

  return (
    <div className="border-t border-white/10 p-4">
      <p className="text-xs text-text-muted mb-2">Ocenite korisnika {imeKorisnika}</p>

      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            onClick={() => setOcena(i)}
            onMouseEnter={() => setHoverOcena(i)}
            onMouseLeave={() => setHoverOcena(0)}
            className="text-2xl leading-none transition"
          >
            <span className={i <= (hoverOcena || ocena) ? 'text-primary' : 'text-white/15'}>★</span>
          </button>
        ))}
      </div>

      <textarea
        value={komentar}
        onChange={(e) => setKomentar(e.target.value)}
        placeholder="Komentar (opciono)..."
        rows={2}
        className="w-full bg-white/[0.03] border border-white/10 rounded-lg p-2.5 text-sm outline-none focus:border-primary/40 transition placeholder:text-text-muted resize-none mb-2"
      />

      <button
        onClick={posalji}
        disabled={ocena === 0 || salje}
        className="bg-gradient-to-r from-primary to-secondary text-background font-bold text-xs px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {salje ? 'Slanje...' : poslato ? 'Ocena sačuvana ✓' : 'Sačuvaj ocenu'}
      </button>
    </div>
  );
}

export default FormaOcene;