import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ZasticenaRuta({ children }) {
  const { korisnik, ucitavanje } = useAuth();

  if (ucitavanje) {
    return <p className="text-text-muted text-center py-20">Učitavanje...</p>;
  }

  if (!korisnik) {
    return <Navigate to="/prijava" replace />;
  }

  return children;
}

export default ZasticenaRuta;