import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DugmeDeli from '../components/DugmeDeli';
import OglasCard from '../components/OglasCard';
import KalkulatorKredita from '../components/KalkulatorKredita';
import OcenaProdavca from '../components/OcenaProdavca';
import api from '../services/api';

const MOCK_SLIKE = [
  'https://placehold.co/800x500/0f1a2e/00e5ff?text=Automobil+1',
  'https://placehold.co/800x500/0f1a2e/00e5ff?text=Automobil+2',
  'https://placehold.co/800x500/0f1a2e/00e5ff?text=Automobil+3',
  'https://placehold.co/800x500/0f1a2e/00e5ff?text=Automobil+4',
];

const LABELI = {
  statusVlasnistva: 'Status vlasništva',
  pogon: 'Pogon',
  snaga: 'Snaga (KS)',
  obrtniMomenat: 'Obrtni momenat (Nm)',
  brojVrata: 'Broj vrata',
  brojSedista: 'Broj sedišta',
  bojaEnterijera: 'Boja enterijera',
  menjac: 'Menjač',
  statusRegistracije: 'Registracija',
  ostecen: 'Oštećen',
  bioUNezgodi: 'Bio u nezgodi',
  brojVlasnika: 'Broj vlasnika',
  telefonOglasivaca: 'Telefon oglašivača',
  zapreminaPrtljaznika: 'Prtljažnik (L)',
  zapreminaMotora: 'Zapremina motora (ccm)',
  velicinaRezervoara: 'Rezervoar (L)',
};

function formatVrednost(kljuc, vrednost) {
  if (typeof vrednost === 'boolean') return vrednost ? 'Da' : 'Ne';
  return vrednost;
}

function OglasDetalji() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [oglas, setOglas] = useState(null);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [greska, setGreska] = useState(null);
  const [poruka, setPoruka] = useState('');
  const [saljemPoruku, setSaljemPoruku] = useState(false);
  const [porukaPoslata, setPorukaPoslata] = useState(false);
  const [greskaPoruka, setGreskaPoruka] = useState('');
  const [aktivnaSlika, setAktivnaSlika] = useState(0);
  const [detaljiOtvoreni, setDetaljiOtvoreni] = useState(false);
  const [slicniOglasi, setSlicniOglasi] = useState([]);

  useEffect(() => {
    api.get(`/oglasi/${id}`)
      .then((res) => setOglas(res.data))
      .catch(() => setGreska('Oglas nije pronađen.'))
      .finally(() => setUcitavanje(false));

    api.get(`/oglasi/${id}/slicni`)
      .then((res) => setSlicniOglasi(res.data))
      .catch(() => {});
  }, [id]);

  const posaljiPoruku = async () => {
    if (!poruka.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) {
      setGreskaPoruka('Morate biti prijavljeni da biste kontaktirali prodavca.');
      return;
    }
    setSaljemPoruku(true);
    setGreskaPoruka('');
    try {
      await api.post('/poruke', { oglasId: id, tekst: poruka });
      setPorukaPoslata(true);
      setPoruka('');
      setTimeout(() => navigate(`/poruke?oglas=${id}`), 1200);
    } catch (err) {
      setGreskaPoruka(err.response?.data?.poruka || 'Greška pri slanju poruke.');
    } finally {
      setSaljemPoruku(false);
    }
  };

  if (ucitavanje) {
    return (
      <div className="min-h-screen bg-background text-text">
        <Navbar />
        <p className="text-text-muted text-center py-20">Učitavanje...</p>
      </div>
    );
  }

  if (greska) {
    return (
      <div className="min-h-screen bg-background text-text">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-text-muted mb-4">{greska}</p>
          <Link to="/pretraga" className="text-primary hover:underline">Nazad na pretragu</Link>
        </div>
      </div>
    );
  }

  const slike = oglas.slike?.length > 0 ? oglas.slike : MOCK_SLIKE;

  const dodatniDetalji = Object.entries(LABELI).filter(
    ([kljuc]) => oglas[kljuc] !== undefined && oglas[kljuc] !== null && oglas[kljuc] !== ''
  );

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-5 gap-10">
        <div className="md:col-span-3">
          <div className="h-80 rounded-2xl overflow-hidden mb-3">
            <img
              src={slike[aktivnaSlika]}
              alt={oglas.naslov}
              className="w-full h-full object-cover"
            />
          </div>

          {slike.length > 1 && (
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {slike.map((slika, i) => (
                <button
                  key={i}
                  onClick={() => setAktivnaSlika(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                    i === aktivnaSlika ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={slika} alt={`Slika ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="font-display text-2xl font-bold">{oglas.naslov}</h1>
            <DugmeDeli naslov={oglas.naslov} />
          </div>
          <div className="flex items-center gap-3 text-text-muted text-sm mb-6">
            <span>{oglas.marka} {oglas.model} · {oglas.lokacija}</span>
            <span className="flex items-center gap-1">
              <span>👁</span>
              <span>{oglas.pregledi || 0} pregleda</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              ['Godište', oglas.godiste],
              ['Kilometraža', `${oglas.kilometraza.toLocaleString()} km`],
              ['Gorivo', oglas.gorivo],
              ['Status', oglas.aktivno ? 'Aktivan' : 'Neaktivan'],
            ].map(([label, val]) => (
              <div key={label} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                <p className="text-text-muted text-xs mb-1">{label}</p>
                <p className="font-medium capitalize">{val}</p>
              </div>
            ))}
          </div>

          {oglas.opis && (
            <div className="mb-6">
              <h3 className="font-display font-medium text-lg mb-2">Opis</h3>
              <p className="text-text-muted text-sm leading-relaxed">{oglas.opis}</p>
            </div>
          )}

          {(dodatniDetalji.length > 0 || oglas.dodatnaOprema?.length > 0) && (
            <div className="border border-white/10 rounded-2xl overflow-hidden">
              <button
                onClick={() => setDetaljiOtvoreni(!detaljiOtvoreni)}
                className="w-full flex justify-between items-center px-5 py-4 hover:bg-white/[0.02] transition"
              >
                <span className="font-display font-medium">Dodatni detalji vozila</span>
                <span className={`text-primary transition-transform duration-300 ${detaljiOtvoreni ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                  detaljiOtvoreni ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 border-t border-white/10 pt-4">
                    {dodatniDetalji.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                        {dodatniDetalji.map(([kljuc, label]) => (
                          <div key={kljuc}>
                            <p className="text-text-muted text-xs mb-1">{label}</p>
                            <p className="font-medium text-sm capitalize">
                              {formatVrednost(kljuc, oglas[kljuc])}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {oglas.dodatnaOprema?.length > 0 && (
                      <div>
                        <p className="text-text-muted text-xs mb-2">Dodatna oprema</p>
                        <div className="flex flex-wrap gap-2">
                          {oglas.dodatnaOprema.map((oprema, i) => (
                            <span
                              key={i}
                              className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full"
                            >
                              {oprema}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <div className="bg-white/[0.03] border border-primary/15 rounded-2xl p-6 sticky top-6">
            <p className="font-display font-bold text-3xl text-primary mb-6">
              {oglas.cena.toLocaleString()} €
            </p>

            <div className="border-t border-white/10 pt-4 mb-6">
              <p className="text-text-muted text-xs mb-1">Prodavac</p>
              <p className="font-medium mb-2">{oglas.prodavac?.ime} {oglas.prodavac?.prezime}</p>
              <OcenaProdavca korisnikId={oglas.prodavac?._id} />
            </div>

            {porukaPoslata ? (
              <p className="text-primary text-sm">Poruka je uspešno poslata prodavcu. Prebacujemo vas u poruke...</p>
            ) : (
              <div>
                <textarea
                  value={poruka}
                  onChange={(e) => setPoruka(e.target.value)}
                  placeholder="Napišite poruku prodavcu..."
                  rows={4}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-sm outline-none focus:border-primary/40 transition placeholder:text-text-muted resize-none mb-3"
                />
                {greskaPoruka && (
                  <p className="text-red-400 text-xs mb-3">{greskaPoruka}</p>
                )}
                <button
                  onClick={posaljiPoruku}
                  disabled={saljemPoruku}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-background font-bold text-sm py-3 rounded-xl disabled:opacity-50"
                >
                  {saljemPoruku ? 'Slanje...' : 'Kontaktiraj prodavca'}
                </button>
              </div>
            )}

            <KalkulatorKredita cena={oglas.cena} />
          </div>
        </div>
      </div>

      {slicniOglasi.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 pb-16">
          <h2 className="font-display text-xl font-medium mb-5">Možda vas zanima</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {slicniOglasi.map((s) => (
              <OglasCard key={s._id} oglas={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OglasDetalji;