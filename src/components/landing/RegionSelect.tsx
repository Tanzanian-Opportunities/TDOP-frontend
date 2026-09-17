import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, MapPin } from 'lucide-react';

export interface RegionOption {
  value: string;
  label: string;
}

interface RegionSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: RegionOption[];
  placeholder?: string;
}

const PANEL_ESTIMATED_HEIGHT = 440;

const RegionSelect: React.FC<RegionSelectProps> = ({ value, onChange, options, placeholder = '' }) => {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const pickDirection = () => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setOpenUp(spaceBelow < PANEL_ESTIMATED_HEIGHT && spaceAbove >= PANEL_ESTIMATED_HEIGHT);
  };

  useEffect(() => {
    if (!open) return;
    pickDirection();
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', pickDirection);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', pickDirection);
    };
  }, [open]);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative z-50">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          open
            ? 'bg-tdop-primary/5 text-tdop-primary'
            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5'
        }`}
      >
        <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
        <span className="whitespace-nowrap">{selected ? selected.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 ml-0.5 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className={`absolute left-0 z-50 w-60 origin-top overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl animate-dropdown-in dark:border-gray-700 dark:bg-gray-800 ${
            openUp ? 'bottom-full mb-2 origin-bottom' : 'mt-2'
          }`}
        >
          <p className="px-4 pt-3 pb-1 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
            {placeholder}
          </p>
          <div className="max-h-[60vh] overflow-y-auto p-1.5">
            {options.map(opt => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isSelected
                      ? 'bg-tdop-primary/10 font-semibold text-tdop-primary'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5'
                  }`}
                >
                  <span className="w-4 shrink-0">
                    {isSelected && <Check className="w-4 h-4" />}
                  </span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionSelect;