import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FormaOcene from '../components/FormaOcene';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Poruke() {
  const { korisnik } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [razgovori, setRazgovori] = useState([]);
  const [ucitavanje, setUcitavanje] = useState(true);
  const [prepiska, setPrepiska] = useState([]);
  const [novaPoruka, setNovaPoruka] = useState('');
  const [salje, setSalje] = useState(false);

  const aktivanOglasId = searchParams.get('oglas');

  useEffect(() => {
    api.get('/poruke')
      .then((res) => setRazgovori(res.data))
      .finally(() => setUcitavanje(false));
  }, []);

  useEffect(() => {
    if (!aktivanOglasId) return;

    api.get(`/poruke/${aktivanOglasId}`)
      .then((res) => setPrepiska(res.data));

    api.put(`/poruke/${aktivanOglasId}/procitano`)
      .then(() => {
        setRazgovori((prethodni) =>
          prethodni.map((r) =>
            r.oglas._id === aktivanOglasId ? { ...r, neprocitano: false } : r
          )
        );
        window.dispatchEvent(new CustomEvent('porukeAzurirane'));
      })
      .catch(() => {});
  }, [aktivanOglasId]);

  const aktivanRazgovor = razgovori.find((r) => r.oglas._id === aktivanOglasId);

  const posalji = async () => {
    if (!novaPoruka.trim() || !aktivanOglasId || !aktivanRazgovor) return;
    setSalje(true);
    try {
      await api.post('/poruke', {
        oglasId: aktivanOglasId,
        tekst: novaPoruka,
        primalacId: aktivanRazgovor.sagovornik._id
      });
      const res = await api.get(`/poruke/${aktivanOglasId}`);
      setPrepiska(res.data);
      setNovaPoruka('');
      window.dispatchEvent(new CustomEvent('porukeAzurirane'));
    } catch (err) {
      alert(err.response?.data?.poruka || 'Greška pri slanju.');
    } finally {
      setSalje(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display text-2xl font-bold mb-6">Poruke</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-2">
            {ucitavanje ? (
              <p className="text-text-muted text-sm">Učitavanje...</p>
            ) : razgovori.length === 0 ? (
              <p className="text-text-muted text-sm">Nemate razgovora.</p>
            ) : (
              razgovori.map((r) => (
                <button
                  key={`${r.oglas._id}_${r.sagovornik._id}`}
                  onClick={() => setSearchParams({ oglas: r.oglas._id })}
                  className={`w-full text-left p-3 rounded-xl border transition relative ${
                    aktivanOglasId === r.oglas._id
                      ? 'border-primary/40 bg-primary/5'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {r.neprocitano && (
                    <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                  )}
                  <p className="text-sm font-medium pr-4">{r.oglas.naslov}</p>
                  <p className="text-text-muted text-xs mt-0.5">
                    {r.sagovornik.ime} {r.sagovornik.prezime}
                  </p>
                  <p className="text-text-muted text-xs mt-1 truncate">{r.poslednjaPoruka}</p>
                </button>
              ))
            )}
          </div>

          <div className="md:col-span-2">
            {!aktivanOglasId ? (
              <div className="h-full flex items-center justify-center text-text-muted text-sm border border-white/5 rounded-2xl py-20">
                Izaberite razgovor sa leve strane
              </div>
            ) : (
              <div className="border border-white/10 rounded-2xl flex flex-col">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm font-medium">{aktivanRazgovor?.oglas.naslov}</p>
                </div>

                <div className="h-80 overflow-y-auto p-4 space-y-3">
                  {prepiska.map((p) => {
                    const jaSam = p.posiljalac._id === korisnik.id || p.posiljalac._id === korisnik._id;
                    return (
                      <div key={p._id} className={`flex ${jaSam ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                            jaSam
                              ? 'bg-gradient-to-r from-primary to-secondary text-background'
                              : 'bg-white/[0.05] text-text'
                          }`}
                        >
                          {p.tekst}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 border-t border-white/10 flex gap-2">
                  <input
                    value={novaPoruka}
                    onChange={(e) => setNovaPoruka(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && posalji()}
                    placeholder="Napišite poruku..."
                    className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm outline-none focus:border-primary/40"
                  />
                  <button
                    onClick={posalji}
                    disabled={salje}
                    className="bg-gradient-to-r from-primary to-secondary text-background font-bold text-sm px-5 rounded-xl disabled:opacity-50"
                  >
                    Pošalji
                  </button>
                </div>

                {aktivanRazgovor && (
                  <FormaOcene
                    korisnikId={aktivanRazgovor.sagovornik._id}
                    imeKorisnika={aktivanRazgovor.sagovornik.ime}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Poruke;