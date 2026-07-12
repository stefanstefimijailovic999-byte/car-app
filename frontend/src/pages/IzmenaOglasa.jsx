import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Dropdown from '../components/Dropdown';
import UploadSlika from '../components/UploadSlika';
import api from '../services/api';

const GORIVA = [
  { value: 'benzin', label: 'Benzin' },
  { value: 'dizel', label: 'Dizel' },
  { value: 'hibrid', label: 'Hibrid' },
  { value: 'elektricni', label: 'Električni' },
];
const POGONI = [
  { value: 'prednji', label: 'Prednji' },
  { value: 'zadnji', label: 'Zadnji' },
  { value: '4x4', label: '4x4' },
];
const MENJACI = [
  { value: 'manuelni', label: 'Manuelni' },
  { value: 'automatski', label: 'Automatski' },
  { value: 'poluautomatski', label: 'Poluautomatski' },
];

function IzmenaOglasa() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [forma, setForma] = useState(null);
  const [slike, setSlike] = useState([]);
  const [greska, setGreska] = useState('');
  const [ucitavanje, setUcitavanje] = useState(true);
  const [cuvanje, setCuvanje] = useState(false);
  const [nemamPravo, setNemamPravo] = useState(false);

  useEffect(() => {
    api.get(`/oglasi/${id}`)
      .then((res) => {
        const o = res.data;
        setForma({
          naslov: o.naslov || '',
          marka: o.marka || '',
          model: o.model || '',
          godiste: o.godiste || '',
          kilometraza: o.kilometraza || '',
          gorivo: o.gorivo || 'benzin',
          cena: o.cena || '',
          opis: o.opis || '',
          lokacija: o.lokacija || '',
          pogon: o.pogon || '',
          snaga: o.snaga || '',
          menjac: o.menjac || '',
          telefonOglasivaca: o.telefonOglasivaca || '',
          aktivno: o.aktivno,
        });
        setSlike(o.slike || []);
      })
      .catch((err) => {
        if (err.response?.status === 403) setNemamPravo(true);
        else setGreska('Oglas nije pronađen.');
      })
      .finally(() => setUcitavanje(false));
  }, [id]);

  const izmeni = (polje) => (e) => {
    setForma({ ...forma, [polje]: e.target.value });
  };

  const izmeniDropdown = (polje) => (vrednost) => {
    setForma({ ...forma, [polje]: vrednost });
  };

  const posalji = async (e) => {
    e.preventDefault();
    setGreska('');
    setCuvanje(true);

    try {
      const podaci = {
        ...forma,
        godiste: Number(forma.godiste),
        kilometraza: Number(forma.kilometraza),
        cena: Number(forma.cena),
        snaga: forma.snaga ? Number(forma.snaga) : undefined,
        pogon: forma.pogon || undefined,
        menjac: forma.menjac || undefined,
        slike,
      };

      await api.put(`/oglasi/${id}`, podaci);
      navigate(`/oglasi/${id}`);
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Greška pri izmeni oglasa.');
    } finally {
      setCuvanje(false);
    }
  };

  const inputKlasa =
    'w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition';
  const dropdownOmotac = 'bg-white/[0.03] border border-white/10 rounded-xl px-1';
  const labelKlasa = 'text-xs text-text-muted block mb-1.5';

  if (ucitavanje) {
    return (
      <div className="min-h-screen bg-background text-text">
        <Navbar />
        <p className="text-text-muted text-center py-20">Učitavanje...</p>
      </div>
    );
  }

  if (nemamPravo) {
    return (
      <div className="min-h-screen bg-background text-text">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-text-muted mb-4">Nemate ovlašćenje da izmenite ovaj oglas.</p>
          <Link to="/profil" className="text-primary hover:underline">Nazad na profil</Link>
        </div>
      </div>
    );
  }

  if (greska && !forma) {
    return (
      <div className="min-h-screen bg-background text-text">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-text-muted mb-4">{greska}</p>
          <Link to="/profil" className="text-primary hover:underline">Nazad na profil</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display text-2xl font-bold mb-1">Izmeni oglas</h1>
        <p className="text-text-muted text-sm mb-8">Ažurirajte podatke o vozilu</p>

        <form onSubmit={posalji} className="space-y-5">
          <div>
            <label className={labelKlasa}>Naslov oglasa</label>
            <input value={forma.naslov} onChange={izmeni('naslov')} required className={inputKlasa} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelKlasa}>Marka</label>
              <input value={forma.marka} onChange={izmeni('marka')} required className={inputKlasa} />
            </div>
            <div>
              <label className={labelKlasa}>Model</label>
              <input value={forma.model} onChange={izmeni('model')} required className={inputKlasa} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelKlasa}>Godište</label>
              <input type="number" value={forma.godiste} onChange={izmeni('godiste')} required min="1950" max={new Date().getFullYear()} className={inputKlasa} />
            </div>
            <div>
              <label className={labelKlasa}>Kilometraža</label>
              <input type="number" value={forma.kilometraza} onChange={izmeni('kilometraza')} required min="0" className={inputKlasa} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelKlasa}>Gorivo</label>
              <div className={dropdownOmotac}>
                <Dropdown label="Gorivo" value={forma.gorivo} onChange={izmeniDropdown('gorivo')} options={GORIVA} />
              </div>
            </div>
            <div>
              <label className={labelKlasa}>Cena (€)</label>
              <input type="number" value={forma.cena} onChange={izmeni('cena')} required min="0" className={inputKlasa} />
            </div>
          </div>

          <div>
            <label className={labelKlasa}>Lokacija</label>
            <input value={forma.lokacija} onChange={izmeni('lokacija')} className={inputKlasa} />
          </div>

          <div>
            <label className={labelKlasa}>Opis</label>
            <textarea value={forma.opis} onChange={izmeni('opis')} rows={4} className={`${inputKlasa} resize-none`} />
          </div>

          <div>
            <label className={labelKlasa}>Fotografije vozila</label>
            <UploadSlika slike={slike} setSlike={setSlike} />
          </div>

          <div className="border-t border-white/10 pt-5">
            <p className="text-sm font-medium mb-4">Dodatni podaci (opciono)</p>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className={labelKlasa}>Pogon</label>
                <div className={dropdownOmotac}>
                  <Dropdown label="Izaberi" value={forma.pogon} onChange={izmeniDropdown('pogon')} options={POGONI} />
                </div>
              </div>
              <div>
                <label className={labelKlasa}>Menjač</label>
                <div className={dropdownOmotac}>
                  <Dropdown label="Izaberi" value={forma.menjac} onChange={izmeniDropdown('menjac')} options={MENJACI} />
                </div>
              </div>
              <div>
                <label className={labelKlasa}>Snaga (KS)</label>
                <input type="number" value={forma.snaga} onChange={izmeni('snaga')} min="0" className={inputKlasa} />
              </div>
            </div>

            <div>
              <label className={labelKlasa}>Telefon</label>
              <input value={forma.telefonOglasivaca} onChange={izmeni('telefonOglasivaca')} className={inputKlasa} />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-5">
            <div>
              <p className="text-sm font-medium">Status oglasa</p>
              <p className="text-text-muted text-xs">Neaktivni oglasi se ne prikazuju u pretrazi</p>
            </div>
            <button
              type="button"
              onClick={() => setForma({ ...forma, aktivno: !forma.aktivno })}
              className={`w-12 h-6 rounded-full transition relative flex-shrink-0 ${
                forma.aktivno ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 bg-background rounded-full transition-transform ${
                  forma.aktivno ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {greska && <p className="text-red-400 text-sm">{greska}</p>}

          <button
            type="submit"
            disabled={cuvanje}
            className="w-full bg-gradient-to-r from-primary to-secondary text-background font-bold text-sm py-3.5 rounded-xl disabled:opacity-50"
          >
            {cuvanje ? 'Čuvanje...' : 'Sačuvaj izmene'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default IzmenaOglasa;