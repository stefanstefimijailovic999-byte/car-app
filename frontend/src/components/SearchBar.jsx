import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Dropdown from './Dropdown';
import NumberStepper from './NumberStepper';

const MARKE = ['Volkswagen', 'BMW', 'Audi', 'Mercedes-Benz', 'Toyota', 'Renault', 'Opel', 'Škoda'];
const GORIVA = [
  { value: 'benzin', label: 'Benzin' },
  { value: 'dizel', label: 'Dizel' },
  { value: 'hibrid', label: 'Hibrid' },
  { value: 'elektricni', label: 'Električni' },
];

const TRENUTNA_GODINA = new Date().getFullYear();
const MIN_GODINA = 1950;

function SearchBar() {
  const [marka, setMarka] = useState('');
  const [gorivo, setGorivo] = useState('');
  const [cenaMin, setCenaMin] = useState('');
  const [cenaMax, setCenaMax] = useState('');
  const [godisteMin, setGodisteMin] = useState('');
  const [godisteMax, setGodisteMax] = useState('');
  const navigate = useNavigate();

  const pretrazi = () => {
    const params = new URLSearchParams();
    if (marka) params.append('marka', marka);
    if (gorivo) params.append('gorivo', gorivo);
    if (cenaMin) params.append('cenaMin', cenaMin);
    if (cenaMax) params.append('cenaMax', cenaMax);
    if (godisteMin) params.append('godisteMin', godisteMin);
    if (godisteMax) params.append('godisteMax', godisteMax);
    navigate(`/pretraga?${params.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white/[0.04] border border-primary/25 p-2 rounded-2xl shadow-[0_0_40px_rgba(0,229,255,0.08)] backdrop-blur-lg">
      {/* Gornji red — marka, gorivo, dugme */}
      <div className="flex items-center divide-x divide-white/10">
        <Dropdown
          label="Marka"
          value={marka}
          onChange={setMarka}
          options={MARKE.map((m) => ({ value: m, label: m }))}
        />
        <Dropdown
          label="Gorivo"
          value={gorivo}
          onChange={setGorivo}
          options={GORIVA}
        />
        <button
          onClick={pretrazi}
          className="bg-gradient-to-r from-primary to-secondary text-background font-bold text-sm px-7 py-2.5 rounded-xl ml-1"
        >
          Pretraži
        </button>
      </div>

      {/* Donji red — opsezi cene i godišta */}
      <div className="flex items-center gap-6 border-t border-white/10 mt-1 pt-3 px-3 pb-1">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted whitespace-nowrap">Cena (€)</span>
          <NumberStepper value={cenaMin} onChange={setCenaMin} step={1000} min={0} placeholder="od" />
          <span className="text-text-muted text-xs">–</span>
          <NumberStepper value={cenaMax} onChange={setCenaMax} step={1000} min={0} placeholder="do" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted whitespace-nowrap">Godište</span>
          <NumberStepper
            value={godisteMin}
            onChange={setGodisteMin}
            step={1}
            min={MIN_GODINA}
            max={TRENUTNA_GODINA}
            placeholder="od"
          />
          <span className="text-text-muted text-xs">–</span>
          <NumberStepper
            value={godisteMax}
            onChange={setGodisteMax}
            step={1}
            min={MIN_GODINA}
            max={TRENUTNA_GODINA}
            placeholder="do"
          />
        </div>
      </div>
    </div>
  );
}

export default SearchBar;