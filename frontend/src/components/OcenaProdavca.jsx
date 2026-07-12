import { useEffect, useState } from 'react';
import api from '../services/api';

function Zvezdice({ vrednost, velicina = 'text-sm' }) {
  return (
    <div className={`flex gap-0.5 ${velicina}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(vrednost) ? 'text-primary' : 'text-white/15'}>
          ★
        </span>
      ))}
    </div>
  );
}

function OcenaProdavca({ korisnikId }) {
  const [podaci, setPodaci] = useState({ prosek: 0, broj: 0, ocene: [] });
  const [ucitavanje, setUcitavanje] = useState(true);

  useEffect(() => {
    if (!korisnikId) return;
    api.get(`/ocene/${korisnikId}`)
      .then((res) => setPodaci(res.data))
      .finally(() => setUcitavanje(false));
  }, [korisnikId]);

  if (ucitavanje) return null;

  if (podaci.broj === 0) {
    return <p className="text-text-muted text-xs">Još uvek nema ocena</p>;
  }

  return (
    <div className="flex items-center gap-2">
      <Zvezdice vrednost={podaci.prosek} />
      <span className="text-sm font-medium">{podaci.prosek}</span>
      <span className="text-text-muted text-xs">({podaci.broj} {podaci.broj === 1 ? 'ocena' : 'ocena'})</span>
    </div>
  );
}

export { Zvezdice };
export default OcenaProdavca;