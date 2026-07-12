import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ZasticenaAdminRuta({ children }) {
  const { korisnik, ucitavanje } = useAuth();

  if (ucitavanje) {
    return <p className="text-text-muted text-center py-20">Učitavanje...</p>;
  }

  if (!korisnik) {
    return <Navigate to="/prijava" replace />;
  }

  if (korisnik.uloga !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ZasticenaAdminRuta;