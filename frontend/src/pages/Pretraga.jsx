import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import OglasCard from '../components/OglasCard';
import Dropdown from '../components/Dropdown';
import api from '../services/api';

const OPCIJE_SORTIRANJA = [
  { value: 'najnovije', label: 'Najnovije prvo' },
  { value: 'najstarije', label: 'Najstarije prvo' },
  { value: 'cenaRastuce', label: 'Cena: rastuće' },
  { value: 'cenaOpadajuce', label: 'Cena: opadajuće' },
  { value: 'godisteNajnovije', label: 'Godište: najnovije' },
  { value: 'kilometrazaNajmanja', label: 'Kilometraža: najmanja' },
];

function Pretraga() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [oglasi, setOglasi] = useState([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [ukupno, setUkupno] = useState(0);
  const [stranica, setStranica] = useState(1);
  const [ukupnoStranica, setUkupnoStranica] = useState(1);

  const sortiraj = searchParams.get('sortiraj') || 'najnovije';

  const promeniSortiranje = (vrednost) => {
    const noviParams = new URLSearchParams(searchParams);
    noviParams.set('sortiraj', vrednost);
    setSearchParams(noviParams);
  };

  useEffect(() => {
    setUcitavanje(true);
    const params = new URLSearchParams(searchParams);
    params.set('stranica', stranica);

    api.get(`/oglasi?${params.toString()}`)
      .then((res) => {
        setOglasi(res.data.oglasi);
        setUkupno(res.data.ukupno);
        setUkupnoStranica(res.data.ukupnoStranica);
      })
      .catch((err) => console.error('Greška pri pretrazi:', err))
      .finally(() => setUcitavanje(false));
  }, [searchParams, stranica]);

  useEffect(() => {
    setStranica(1);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />

      <div className="px-12 pt-10 pb-6">
        <SearchBar />
      </div>

      <div className="px-12 pb-20">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-display text-xl font-medium">
            {ucitavanje ? 'Pretraga...' : `${ukupno} ${ukupno === 1 ? 'oglas' : 'oglasa'} pronađeno`}
          </h2>

          <div className="w-56 bg-white/[0.03] border border-white/10 rounded-xl px-1">
            <Dropdown
              label="Sortiraj po"
              value={sortiraj}
              onChange={promeniSortiranje}
              options={OPCIJE_SORTIRANJA}
            />
          </div>
        </div>

        {ucitavanje ? (
          <p className="text-text-muted">Učitavanje...</p>
        ) : oglasi.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-2xl">
            <p className="text-text-muted mb-2">Nema oglasa koji odgovaraju izabranim filterima.</p>
            <p className="text-text-muted text-sm">Probaj da promeniš kriterijume pretrage.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {oglasi.map((oglas) => (
                <OglasCard key={oglas._id} oglas={oglas} />
              ))}
            </div>

            {ukupnoStranica > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: ukupnoStranica }, (_, i) => i + 1).map((br) => (
                  <button
                    key={br}
                    onClick={() => setStranica(br)}
                    className={`w-9 h-9 rounded-lg text-sm transition ${
                      br === stranica
                        ? 'bg-gradient-to-r from-primary to-secondary text-background font-bold'
                        : 'text-text-muted hover:bg-white/5'
                    }`}
                  >
                    {br}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Pretraga;