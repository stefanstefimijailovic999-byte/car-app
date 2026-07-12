import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [korisnik, setKorisnik] = useState(null);
  const [omiljeni, setOmiljeni] = useState([]);
  const [ucitavanje, setUcitavanje] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUcitavanje(false);
      return;
    }

    api.get('/auth/profil')
      .then((res) => {
        setKorisnik(res.data.korisnik);
        setOmiljeni(res.data.korisnik.omiljeni || []);
      })
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setUcitavanje(false));
  }, []);

  const prijaviSe = (token, korisnikPodaci) => {
    localStorage.setItem('token', token);
    setKorisnik(korisnikPodaci);
    setOmiljeni(korisnikPodaci.omiljeni || []);
  };

  const odjaviSe = () => {
    localStorage.removeItem('token');
    setKorisnik(null);
    setOmiljeni([]);
  };

  const jeOmiljen = (oglasId) => omiljeni.includes(oglasId);

  const prebaciOmiljen = async (oglasId) => {
    if (jeOmiljen(oglasId)) {
      await api.delete(`/auth/omiljeni/${oglasId}`);
      setOmiljeni(omiljeni.filter((id) => id !== oglasId));
    } else {
      await api.post(`/auth/omiljeni/${oglasId}`);
      setOmiljeni([...omiljeni, oglasId]);
    }
  };

  return (
    <AuthContext.Provider
      value={{ korisnik, ucitavanje, prijaviSe, odjaviSe, omiljeni, jeOmiljen, prebaciOmiljen }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}