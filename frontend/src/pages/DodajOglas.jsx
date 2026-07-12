import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

const POCETNO_STANJE = {
  naslov: '',
  marka: '',
  model: '',
  godiste: '',
  kilometraza: '',
  gorivo: 'benzin',
  cena: '',
  opis: '',
  lokacija: '',
  pogon: '',
  snaga: '',
  menjac: '',
  telefonOglasivaca: '',
};

function DodajOglas() {
  const [forma, setForma] = useState(POCETNO_STANJE);
  const [slike, setSlike] = useState([]);
  const [greska, setGreska] = useState('');
  const [ucitavanje, setUcitavanje] = useState(false);
  const navigate = useNavigate();

  const izmeni = (polje) => (e) => {
    setForma({ ...forma, [polje]: e.target.value });
  };

  const izmeniDropdown = (polje) => (vrednost) => {
    setForma({ ...forma, [polje]: vrednost });
  };

  const posalji = async (e) => {
    e.preventDefault();
    setGreska('');
    setUcitavanje(true);

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

      const res = await api.post('/oglasi', podaci);
      navigate(`/oglasi/${res.data._id}`);
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Greška pri kreiranju oglasa.');
    } finally {
      setUcitavanje(false);
    }
  };

  const inputKlasa =
    'w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition';
  const dropdownOmotac =
    'bg-white/[0.03] border border-white/10 rounded-xl px-1';
  const labelKlasa = 'text-xs text-text-muted block mb-1.5';

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display text-2xl font-bold mb-1">Dodaj oglas</h1>
        <p className="text-text-muted text-sm mb-8">Popunite podatke o vozilu koje prodajete</p>

        <form onSubmit={posalji} className="space-y-5">
          <div>
            <label className={labelKlasa}>Naslov oglasa</label>
            <input value={forma.naslov} onChange={izmeni('naslov')} required className={inputKlasa} placeholder="npr. BMW 320d, odlično stanje" />
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
                <Dropdown
                  label="Gorivo"
                  value={forma.gorivo}
                  onChange={izmeniDropdown('gorivo')}
                  options={GORIVA}
                />
              </div>
            </div>
            <div>
              <label className={labelKlasa}>Cena (€)</label>
              <input type="number" value={forma.cena} onChange={izmeni('cena')} required min="0" className={inputKlasa} />
            </div>
          </div>

          <div>
            <label className={labelKlasa}>Lokacija</label>
            <input value={forma.lokacija} onChange={izmeni('lokacija')} className={inputKlasa} placeholder="npr. Novi Sad" />
          </div>

          <div>
            <label className={labelKlasa}>Opis</label>
            <textarea value={forma.opis} onChange={izmeni('opis')} rows={4} className={`${inputKlasa} resize-none`} placeholder="Detaljan opis stanja vozila..." />
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
                  <Dropdown
                    label="Izaberi"
                    value={forma.pogon}
                    onChange={izmeniDropdown('pogon')}
                    options={POGONI}
                  />
                </div>
              </div>
              <div>
                <label className={labelKlasa}>Menjač</label>
                <div className={dropdownOmotac}>
                  <Dropdown
                    label="Izaberi"
                    value={forma.menjac}
                    onChange={izmeniDropdown('menjac')}
                    options={MENJACI}
                  />
                </div>
              </div>
              <div>
                <label className={labelKlasa}>Snaga (KS)</label>
                <input type="number" value={forma.snaga} onChange={izmeni('snaga')} min="0" className={inputKlasa} />
              </div>
            </div>

            <div>
              <label className={labelKlasa}>Telefon</label>
              <input value={forma.telefonOglasivaca} onChange={izmeni('telefonOglasivaca')} className={inputKlasa} placeholder="06X XXX XXXX" />
            </div>
          </div>

          {greska && <p className="text-red-400 text-sm">{greska}</p>}

          <button
            type="submit"
            disabled={ucitavanje}
            className="w-full bg-gradient-to-r from-primary to-secondary text-background font-bold text-sm py-3.5 rounded-xl disabled:opacity-50"
          >
            {ucitavanje ? 'Objavljivanje...' : 'Objavi oglas'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DodajOglas;