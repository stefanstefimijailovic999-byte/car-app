import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Registracija() {
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [greska, setGreska] = useState('');
  const [ucitavanje, setUcitavanje] = useState(false);
  const { prijaviSe } = useAuth();
  const navigate = useNavigate();

  const posalji = async (e) => {
    e.preventDefault();
    setGreska('');

    if (lozinka.length < 6) {
      setGreska('Lozinka mora imati bar 6 karaktera.');
      return;
    }

    setUcitavanje(true);
    try {
      const res = await api.post('/auth/registracija', { ime, prezime, email, lozinka });
      prijaviSe(res.data.token, res.data.korisnik);
      navigate('/');
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Greška pri registraciji.');
    } finally {
      setUcitavanje(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="max-w-sm mx-auto px-6 py-20">
        <h1 className="font-display text-2xl font-bold mb-1">Registracija</h1>
        <p className="text-text-muted text-sm mb-8">Napravite carVector nalog</p>

        <form onSubmit={posalji} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted block mb-1.5">Ime</label>
              <input
                value={ime}
                onChange={(e) => setIme(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1.5">Prezime</label>
              <input
                value={prezime}
                onChange={(e) => setPrezime(e.target.value)}
                required
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-text-muted block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition"
            />
          </div>

          <div>
            <label className="text-xs text-text-muted block mb-1.5">Lozinka</label>
            <input
              type="password"
              value={lozinka}
              onChange={(e) => setLozinka(e.target.value)}
              required
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/40 transition"
            />
            <p className="text-text-muted text-xs mt-1.5">Minimum 6 karaktera</p>
          </div>

          {greska && <p className="text-red-400 text-sm">{greska}</p>}

          <button
            type="submit"
            disabled={ucitavanje}
            className="w-full bg-gradient-to-r from-primary to-secondary text-background font-bold text-sm py-3 rounded-xl disabled:opacity-50"
          >
            {ucitavanje ? 'Kreiranje naloga...' : 'Registruj se'}
          </button>
        </form>

        <p className="text-text-muted text-sm mt-6 text-center">
          Već imate nalog?{' '}
          <Link to="/prijava" className="text-primary hover:underline">
            Prijavite se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Registracija;