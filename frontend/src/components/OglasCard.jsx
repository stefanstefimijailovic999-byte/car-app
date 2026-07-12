import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OglasCard({ oglas }) {
  const { korisnik, jeOmiljen, prebaciOmiljen } = useAuth();

  const klikSrce = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!korisnik) return;
    await prebaciOmiljen(oglas._id);
  };

  return (
    <Link
      to={`/oglasi/${oglas._id}`}
      className="block bg-white/[0.03] border border-primary/10 rounded-2xl overflow-hidden hover:border-primary/30 transition relative"
    >
      <div className="h-40 bg-gradient-to-br from-background-light to-background flex items-center justify-center text-primary/20 text-sm relative">
        {oglas.slike?.[0] ? (
          <img src={oglas.slike[0]} alt={oglas.naslov} className="w-full h-full object-cover" />
        ) : (
          'Fotografija vozila'
        )}

        {korisnik && (
          <button
            onClick={klikSrce}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-lg"
          >
            {jeOmiljen(oglas._id) ? (
              <span className="text-primary">♥</span>
            ) : (
              <span className="text-text-muted">♡</span>
            )}
          </button>
        )}
      </div>
      <div className="p-4">
        <span className="inline-block bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-full mb-2 capitalize">
          {oglas.gorivo}
        </span>
        <h3 className="font-medium text-base mb-1">{oglas.naslov}</h3>
        <p className="text-text-muted text-xs mb-3">
          {oglas.godiste} · {oglas.kilometraza.toLocaleString()} km · {oglas.lokacija}
        </p>
        <p className="font-display font-bold text-primary text-xl">
          {oglas.cena.toLocaleString()} €
        </p>
      </div>
    </Link>
  );
}

export default OglasCard;