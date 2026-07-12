import { useState } from 'react';

function DugmeDeli({ naslov }) {
  const [kopirano, setKopirano] = useState(false);

  const podeli = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: naslov, url });
        return;
      } catch (err) {
        // Korisnik je otkazao share dijalog — ne radimo ništa
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback — kopiraj link u clipboard
    try {
      await navigator.clipboard.writeText(url);
      setKopirano(true);
      setTimeout(() => setKopirano(false), 2000);
    } catch (err) {
      console.error('Greška pri kopiranju linka:', err);
    }
  };

  return (
    <button
      onClick={podeli}
      className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition border border-white/10 hover:border-primary/30 rounded-lg px-4 py-2"
    >
      {kopirano ? (
        <>
          <span className="text-primary">✓</span>
          <span className="text-primary">Link kopiran</span>
        </>
      ) : (
        <>
          <span>↗</span>
          <span>Podeli oglas</span>
        </>
      )}
    </button>
  );
}

export default DugmeDeli;