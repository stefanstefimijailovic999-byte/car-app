import { useState } from 'react';

const PERIODI = [12, 24, 36, 48, 60, 72];

function KalkulatorKredita({ cena }) {
  const [ucesce, setUcesce] = useState(Math.round(cena * 0.2));
  const [period, setPeriod] = useState(36);
  const [kamata] = useState(7.5); // fiksna godišnja kamatna stopa, informativno

  const iznosKredita = Math.max(cena - ucesce, 0);
  const mesecnaKamata = kamata / 100 / 12;

  const mesecnaRata =
    iznosKredita > 0 && mesecnaKamata > 0
      ? (iznosKredita * mesecnaKamata) / (1 - Math.pow(1 + mesecnaKamata, -period))
      : iznosKredita / period;

  return (
    <div className="border border-white/10 rounded-2xl p-5 mt-4">
      <p className="font-display font-medium text-sm mb-4">Kalkulator kredita</p>

      <div className="mb-4">
        <div className="flex justify-between text-xs text-text-muted mb-1.5">
          <span>Učešće</span>
          <span>{ucesce.toLocaleString()} €</span>
        </div>
        <input
          type="range"
          min="0"
          max={cena}
          step="500"
          value={ucesce}
          onChange={(e) => setUcesce(Number(e.target.value))}
          className="w-full accent-primary"
        />
      </div>

      <div className="mb-5">
        <p className="text-xs text-text-muted mb-2">Period otplate</p>
        <div className="flex flex-wrap gap-2">
          {PERIODI.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs transition ${
                period === p
                  ? 'bg-gradient-to-r from-primary to-secondary text-background font-bold'
                  : 'bg-white/[0.03] border border-white/10 text-text-muted hover:border-white/20'
              }`}
            >
              {p} mes.
            </button>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 flex justify-between items-center">
        <div>
          <p className="text-text-muted text-xs mb-0.5">Mesečna rata (okvirno)</p>
          <p className="text-text-muted text-[10px]">Kamatna stopa {kamata}% godišnje, informativno</p>
        </div>
        <p className="font-display font-bold text-xl text-primary">
          {Math.round(mesecnaRata).toLocaleString()} €
        </p>
      </div>
    </div>
  );
}

export default KalkulatorKredita;