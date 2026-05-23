import { Search, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => onSearch(value), 200);
    return () => clearTimeout(timer);
  }, [value, onSearch]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar Pokémon..."
        className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-10 shadow-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-text-primary placeholder:text-text-tertiary"
        aria-label="Buscar Pokémon por nome"
      />
      {value && (
        <button
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-all"
          aria-label="Limpar busca"
        >
          <X size={16} />
        </button>
      )}
      <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-1 px-1.5 py-0.5 rounded-md bg-surface-secondary border border-border text-[10px] font-mono text-text-tertiary pointer-events-none">
        {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}K
      </kbd>
    </div>
  );
}
