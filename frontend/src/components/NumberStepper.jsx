function NumberStepper({ value, onChange, step = 1, min, max, placeholder }) {
  const promeni = (delta) => {
    const trenutna = value === '' ? (min ?? 0) : Number(value);
    let nova = trenutna + delta;
    if (min !== undefined) nova = Math.max(min, nova);
    if (max !== undefined) nova = Math.min(max, nova);
    onChange(String(nova));
  };

  const rucniUnos = (e) => {
    const val = e.target.value;
    if (val === '') return onChange('');
    let broj = Number(val);
    if (min !== undefined) broj = Math.max(min, broj);
    if (max !== undefined) broj = Math.min(max, broj);
    onChange(String(broj));
  };

  return (
    <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => promeni(-step)}
        className="w-7 h-8 flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition text-sm"
      >
        −
      </button>
      <input
        value={value}
        onChange={rucniUnos}
        type="number"
        placeholder={placeholder}
        className="w-16 bg-transparent text-sm text-center outline-none placeholder:text-text-muted [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => promeni(step)}
        className="w-7 h-8 flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition text-sm"
      >
        +
      </button>
    </div>
  );
}

export default NumberStepper;