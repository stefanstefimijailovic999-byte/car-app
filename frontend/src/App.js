import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import ZasticenaRuta from './components/ZasticenaRuta';
import ZasticenaAdminRuta from './components/ZasticenaAdminRuta';
import Home from './pages/Home';
import Pretraga from './pages/Pretraga';
import OglasDetalji from './pages/OglasDetalji';
import Prijava from './pages/Prijava';
import Registracija from './pages/Registracija';
import DodajOglas from './pages/DodajOglas';
import IzmenaOglasa from './pages/IzmenaOglasa';
import Profil from './pages/Profil';
import AdminPanel from './pages/AdminPanel';
import Omiljeni from './pages/Omiljeni';
import Poruke from './pages/Poruke';
import ONama from './pages/ONama';
import Kontakt from './pages/Kontakt';
import NijeNadjeno from './pages/NijeNadjeno';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pretraga" element={<Pretraga />} />
          <Route path="/oglasi/:id" element={<OglasDetalji />} />
          <Route path="/prijava" element={<Prijava />} />
          <Route path="/registracija" element={<Registracija />} />
          <Route path="/o-nama" element={<ONama />} />
          <Route path="/kontakt" element={<Kontakt />} />
          <Route
            path="/dodaj-oglas"
            element={
              <ZasticenaRuta>
                <DodajOglas />
              </ZasticenaRuta>
            }
          />
          <Route
            path="/oglasi/:id/izmeni"
            element={
              <ZasticenaRuta>
                <IzmenaOglasa />
              </ZasticenaRuta>
            }
          />
          <Route
            path="/profil"
            element={
              <ZasticenaRuta>
                <Profil />
              </ZasticenaRuta>
            }
          />
          <Route
            path="/omiljeni"
            element={
              <ZasticenaRuta>
                <Omiljeni />
              </ZasticenaRuta>
            }
          />
          <Route
            path="/poruke"
            element={
              <ZasticenaRuta>
                <Poruke />
              </ZasticenaRuta>
            }
          />
          <Route
            path="/admin"
            element={
              <ZasticenaAdminRuta>
                <AdminPanel />
              </ZasticenaAdminRuta>
            }
          />
          <Route path="*" element={<NijeNadjeno />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;