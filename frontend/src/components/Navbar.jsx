import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Navbar() {
  const { korisnik, odjaviSe } = useAuth();
  const navigate = useNavigate();
  const [neprocitanihBroj, setNeprocitanihBroj] = useState(0);

  const osveziBroj = useCallback(() => {
    if (!korisnik) return;
    api.get('/poruke/nepr/broj')
      .then((res) => setNeprocitanihBroj(res.data.broj))
      .catch(() => {});
  }, [korisnik]);

  useEffect(() => {
    osveziBroj();
  }, [osveziBroj]);

  // Osluškuje signal iz Poruke.jsx kad se nešto pročita ili pošalje
  useEffect(() => {
    window.addEventListener('porukeAzurirane', osveziBroj);
    return () => window.removeEventListener('porukeAzurirane', osveziBroj);
  }, [osveziBroj]);

  const handleOdjava = () => {
    odjaviSe();
    navigate('/');
  };

  return (
    <nav className="flex justify-between items-center px-12 py-5 border-b border-primary/10 backdrop-blur-md">
      <Link to="/" className="font-display font-bold text-xl tracking-wide">
        car<span className="text-primary">Vector</span>
      </Link>

      <div className="hidden md:flex gap-8 text-sm text-text-muted">
        <Link to="/pretraga" className="hover:text-primary transition">Pretraga</Link>
        <Link to="/dodaj-oglas" className="hover:text-primary transition">Prodaj</Link>
        <Link to="/o-nama" className="hover:text-primary transition">O nama</Link>
        <Link to="/kontakt" className="hover:text-primary transition">Kontakt</Link>
      </div>

      {korisnik ? (
        <div className="flex items-center gap-4">
          {korisnik.uloga === 'admin' && (
            <Link to="/admin" className="text-sm text-text-muted hover:text-primary transition">
              Admin
            </Link>
          )}
          <Link to="/poruke" className="relative text-sm text-text-muted hover:text-primary transition">
            Poruke
            {neprocitanihBroj > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
            )}
          </Link>
          <Link to="/omiljeni" className="text-sm text-text-muted hover:text-primary transition">
            Omiljeni
          </Link>
          <Link to="/profil" className="text-sm text-text-muted hover:text-primary transition">
            {korisnik.ime}
          </Link>
          <button
            onClick={handleOdjava}
            className="text-sm text-text-muted hover:text-primary transition"
          >
            Odjava
          </button>
        </div>
      ) : (
        <Link
          to="/prijava"
          className="bg-gradient-to-r from-primary to-secondary text-background font-bold text-sm px-6 py-2.5 rounded-md hover:opacity-90 transition"
        >
          Prijava
        </Link>
      )}
    </nav>
  );
}

export default Navbar;