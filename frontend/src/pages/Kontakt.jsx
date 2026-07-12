import { useState } from 'react';
import Navbar from '../components/Navbar';

function Kontakt() {
  const [ime, setIme] = useState('');
  const [email, setEmail] = useState('');
  const [poruka, setPoruka] = useState('');
  const [poslato, setPoslato] = useState(false);

  const posalji = (e) => {
    e.preventDefault();
    // Napomena: ovo trenutno samo simulira slanje (nema backend rute za kontakt formu).
    // Može se kasnije povezati sa pravim email servisom ako zatreba.
    setPoslato(true);
  };

  const inputKlasa =
    'w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition';
  const labelKlasa = 'text-xs text-text-muted block mb-1.5';

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="max-w-lg mx-auto px-6 py-16">
        <p className="text-primary text-sm tracking-widest font-medium mb-3">KONTAKT</p>
        <h1 className="font-display text-2xl font-bold mb-2">Imate pitanje?</h1>
        <p className="text-text-muted text-sm mb-8">
          Pošaljite nam poruku i odgovorićemo u najkraćem mogućem roku.
        </p>

        {poslato ? (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
            <p className="text-primary font-medium">Poruka je poslata. Hvala!</p>
          </div>
        ) : (
          <form onSubmit={posalji} className="space-y-4">
            <div>
              <label className={labelKlasa}>Ime</label>
              <input value={ime} onChange={(e) => setIme(e.target.value)} required className={inputKlasa} />
            </div>
            <div>
              <label className={labelKlasa}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputKlasa} />
            </div>
            <div>
              <label className={labelKlasa}>Poruka</label>
              <textarea
                value={poruka}
                onChange={(e) => setPoruka(e.target.value)}
                rows={5}
                required
                className={`${inputKlasa} resize-none`}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-background font-bold text-sm py-3 rounded-xl"
            >
              Pošalji poruku
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Kontakt;