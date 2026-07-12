import { useState, useRef, useEffect } from 'react';

function Dropdown({ label, value, options, onChange }) {
  const [otvoren, setOtvoren] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const zatvoriVan = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOtvoren(false);
    };
    document.addEventListener('mousedown', zatvoriVan);
    return () => document.removeEventListener('mousedown', zatvoriVan);
  }, []);

  const trenutna = options.find((o) => o.value === value);

  return (
    <div className="relative flex-1" ref={ref}>
      <button
        type="button"
        onClick={() => setOtvoren(!otvoren)}
        className="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition flex justify-between items-center"
      >
        <span className={trenutna ? 'text-text' : 'text-text-muted'}>
          {trenutna ? trenutna.label : label}
        </span>
        <span className="text-text-muted text-xs ml-2">▾</span>
      </button>

      {otvoren && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#0d1524] border border-primary/20 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] z-20 overflow-hidden">
          <div
            onClick={() => { onChange(''); setOtvoren(false); }}
            className="px-4 py-2.5 text-sm text-text-muted hover:bg-primary/10 hover:text-primary cursor-pointer"
          >
            Sve
          </div>
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOtvoren(false); }}
              className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-primary/10 hover:text-primary ${
                value === opt.value ? 'text-primary bg-primary/5' : 'text-text'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;