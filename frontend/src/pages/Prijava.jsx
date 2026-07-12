import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Prijava() {
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [greska, setGreska] = useState('');
  const [ucitavanje, setUcitavanje] = useState(false);
  const { prijaviSe } = useAuth();
  const navigate = useNavigate();

  const posalji = async (e) => {
    e.preventDefault();
    setGreska('');
    setUcitavanje(true);
    try {
      const res = await api.post('/auth/prijava', { email, lozinka });
      prijaviSe(res.data.token, res.data.korisnik);
      navigate('/');
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Greška pri prijavi.');
    } finally {
      setUcitavanje(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="max-w-sm mx-auto px-6 py-20">
        <h1 className="font-display text-2xl font-bold mb-1">Prijava</h1>
        <p className="text-text-muted text-sm mb-8">Prijavite se na svoj carVector nalog</p>

        <form onSubmit={posalji} className="space-y-4">
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
          </div>

          {greska && <p className="text-red-400 text-sm">{greska}</p>}

          <button
            type="submit"
            disabled={ucitavanje}
            className="w-full bg-gradient-to-r from-primary to-secondary text-background font-bold text-sm py-3 rounded-xl disabled:opacity-50"
          >
            {ucitavanje ? 'Prijavljivanje...' : 'Prijavi se'}
          </button>
        </form>

        <p className="text-text-muted text-sm mt-6 text-center">
          Nemate nalog?{' '}
          <Link to="/registracija" className="text-primary hover:underline">
            Registrujte se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Prijava;