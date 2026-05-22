interface SearchBarProps {
  onSearch: (term: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className="mb-8 flex justify-center">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Buscar Pokémon..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 pl-12 pr-4 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
          🔍
        </span>
      </div>
    </div>
  );
}