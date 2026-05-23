import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="p-2.5 sm:p-3 rounded-full bg-surface/80 backdrop-blur-md border border-border shadow-lg hover:scale-110 active:scale-95 transition-all text-text-secondary hover:text-text-primary"
      aria-label={`Mudar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
    >
      {theme === 'dark' ? (
        <Sun size={18} className="sm:size-[20px] text-yellow-400" />
      ) : (
        <Moon size={18} className="sm:size-[20px]" />
      )}
    </button>
  );
}
