import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function NijeNadjeno() {
  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />
      <div className="flex flex-col items-center justify-center text-center py-32 px-6">
        <p className="font-display text-8xl font-bold text-primary/20 mb-2">404</p>
        <h1 className="font-display text-2xl font-bold mb-2">Stranica nije pronađena</h1>
        <p className="text-text-muted text-sm mb-8 max-w-sm">
          Stranica koju tražite ne postoji ili je premeštena.
        </p>
        <Link
          to="/"
          className="bg-gradient-to-r from-primary to-secondary text-background font-bold text-sm px-6 py-2.5 rounded-md hover:opacity-90 transition"
        >
          Nazad na početnu
        </Link>
      </div>
    </div>
  );
}

export default NijeNadjeno;