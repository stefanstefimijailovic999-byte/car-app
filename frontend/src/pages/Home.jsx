import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import OglasCard from '../components/OglasCard';
import api from '../services/api';

function Home() {
  const [oglasi, setOglasi] = useState([]);
  const [ucitavanje, setUcitavanje] = useState(true);

  useEffect(() => {
    api.get('/oglasi')
      .then((res) => setOglasi(res.data.oglasi))
      .catch((err) => console.error('Greška pri učitavanju oglasa:', err))
      .finally(() => setUcitavanje(false));
  }, []);

  return (
    <div className="min-h-screen bg-background text-text">
      <Navbar />

      <div className="text-center py-24 px-6">
        <p className="text-primary text-sm tracking-widest font-medium">
          DIGITALNO TRŽIŠTE VOZILA
        </p>
        <h1 className="font-display text-5xl font-bold mt-4 mb-6">
          Pronađi svoj<br />sledeći automobil
        </h1>
        <p className="text-text-muted max-w-lg mx-auto mb-9">
          Pretraži hiljade polovnih i novih vozila, sa naprednim filtriranjem i direktnom komunikacijom sa prodavcima.
        </p>
        <SearchBar />
      </div>

      <div className="px-12 pb-20">
        <h2 className="font-display text-2xl font-medium mb-5">Izdvojeni oglasi</h2>

        {ucitavanje ? (
          <p className="text-text-muted">Učitavanje oglasa...</p>
        ) : oglasi.length === 0 ? (
          <p className="text-text-muted">Trenutno nema aktivnih oglasa.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {oglasi.map((oglas) => (
              <OglasCard key={oglas._id} oglas={oglas} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;