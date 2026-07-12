import { useRef, useState } from 'react';
import api from '../services/api';

function UploadSlika({ slike, setSlike }) {
  const inputRef = useRef(null);
  const [ucitavanje, setUcitavanje] = useState(false);
  const [greska, setGreska] = useState('');

  const MAX_SLIKA = 30;

  const obradiFajlove = async (fajlovi) => {
    setGreska('');

    if (slike.length + fajlovi.length > MAX_SLIKA) {
      setGreska(`Maksimalno ${MAX_SLIKA} slika po oglasu (trenutno imate ${slike.length}).`);
      return;
    }

    const formData = new FormData();
    Array.from(fajlovi).forEach((fajl) => formData.append('slike', fajl));

    setUcitavanje(true);
    try {
      const res = await api.post('/oglasi/upload-slike', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSlike([...slike, ...res.data.slike]);
    } catch (err) {
      setGreska(err.response?.data?.poruka || 'Greška pri otpremanju slika.');
    } finally {
      setUcitavanje(false);
    }
  };

  const ukloniSliku = (index) => {
    setSlike(slike.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
        {slike.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
            <img src={url} alt={`Slika ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => ukloniSliku(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-background/80 text-text rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        ))}

        {slike.length < MAX_SLIKA && (
          <button
            type="button"
            onClick={() => inputRef.current.click()}
            disabled={ucitavanje}
            className="aspect-square rounded-lg border border-dashed border-white/20 hover:border-primary/40 transition flex flex-col items-center justify-center text-text-muted hover:text-primary disabled:opacity-50"
          >
            <span className="text-xl leading-none mb-1">+</span>
            <span className="text-[10px]">{ucitavanje ? 'Slanje...' : 'Dodaj'}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        multiple
        onChange={(e) => obradiFajlove(e.target.files)}
        className="hidden"
      />

      <p className="text-text-muted text-xs">
        {slike.length} / {MAX_SLIKA} slika
      </p>
      {greska && <p className="text-red-400 text-xs mt-1">{greska}</p>}
    </div>
  );
}

export default UploadSlika;