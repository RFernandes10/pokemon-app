import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { PokemonDetail } from '../types/pokemon';
import { EvolutionChain } from './EvolutionChain';
import { TypeMatchup } from './TypeMatchup';
import { Play, X, Loader2 } from 'lucide-react';

interface PokemonModalProps {
  pokemon: PokemonDetail | null;
  onClose: () => void;
  onPokemonChange: (pokemon: PokemonDetail) => void;
}

const typeColors: Record<string, string> = {
  fire: "bg-red-500", water: "bg-blue-500", grass: "bg-green-500",
  electric: "bg-yellow-400", psychic: "bg-pink-500", ice: "bg-cyan-300",
  dragon: "bg-purple-600", normal: "bg-gray-400", fighting: "bg-orange-600",
  poison: "bg-purple-500", ground: "bg-yellow-600", flying: "bg-indigo-300",
  bug: "bg-lime-500", rock: "bg-yellow-700", ghost: "bg-indigo-800",
  steel: "bg-slate-400", fairy: "bg-pink-400", dark: "bg-slate-700",
};

const typeGradients: Record<string, string> = {
  fire: "from-red-500 to-orange-500", water: "from-blue-500 to-cyan-500",
  grass: "from-green-500 to-emerald-500", electric: "from-yellow-400 to-amber-500",
  psychic: "from-pink-500 to-rose-500", ice: "from-cyan-300 to-blue-400",
  dragon: "from-purple-600 to-indigo-600", normal: "from-gray-400 to-slate-400",
  fighting: "from-orange-600 to-red-600", poison: "from-purple-500 to-violet-500",
  ground: "from-yellow-600 to-amber-700", flying: "from-indigo-300 to-blue-500",
  bug: "from-lime-500 to-green-500", rock: "from-yellow-700 to-stone-600",
  ghost: "from-indigo-800 to-purple-700", steel: "from-slate-400 to-gray-500",
  fairy: "from-pink-400 to-pink-600", dark: "from-slate-700 to-gray-800",
};

const statLabels: Record<string, string> = {
  hp: 'HP', attack: 'Ataque', defense: 'Defesa',
  'special-attack': 'Atq. Esp.', 'special-defense': 'Def. Esp.', speed: 'Velocidade',
};

export function PokemonModal({ pokemon, onClose, onPokemonChange }: PokemonModalProps) {
  const [currentData, setCurrentData] = useState<PokemonDetail | null>(pokemon);
  const [modalLoading, setModalLoading] = useState(false);
  const [cachedPokemons, setCachedPokemons] = useState<Record<number, PokemonDetail>>({});

  useEffect(() => {
    if (pokemon) {
      setCurrentData(pokemon);
      setCachedPokemons(prev => ({ ...prev, [pokemon.id]: pokemon }));
    }
  }, [pokemon]);

  const handleEvolutionClick = useCallback(async (id: number) => {
    if (currentData?.id === id) return;

    if (cachedPokemons[id]) {
      setCurrentData(cachedPokemons[id]);
      return;
    }

    setModalLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCachedPokemons(prev => ({ ...prev, [id]: data }));
      setCurrentData(data);
      onPokemonChange(data);
    } catch (error) {
      console.error("Erro ao carregar evolução", error);
    } finally {
      setModalLoading(false);
    }
  }, [currentData, cachedPokemons, onPokemonChange]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!currentData) return null;

  const mainType = currentData.types[0]?.type.name || 'normal';
  const bgGradient = typeGradients[mainType] || 'from-gray-500 to-slate-500';

  const getStatWidth = (val: number) => Math.min((val / 150) * 100, 100);
  const getStatColor = (val: number) => {
    if (val >= 100) return 'bg-green-500';
    if (val >= 60) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const playCry = () => {
    if (currentData.cries?.latest) {
      const audio = new Audio(currentData.cries.latest);
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes de ${currentData.name}`}
    >
      <div
        className="relative w-full sm:max-w-2xl bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-slide-up sm:animate-scale-in border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`relative h-36 sm:h-40 bg-gradient-to-br ${bgGradient} flex items-center justify-center shrink-0`}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center text-white transition-colors z-10"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); playCry(); }}
            className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-9 h-9 sm:w-10 sm:h-10 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center text-white transition-colors z-10"
            aria-label="Tocar grito do Pokémon"
          >
            <Play size={16} fill="currentColor" />
          </button>

          {modalLoading ? (
            <div className="flex items-center gap-2 text-white font-medium">
              <Loader2 size={20} className="animate-spin" />
              <span>Carregando...</span>
            </div>
          ) : (
            <img
              src={currentData.sprites.other.dream_world.front_default || currentData.sprites.front_default}
              alt={currentData.name}
              className="h-40 w-40 sm:h-48 sm:w-48 object-contain drop-shadow-2xl -mb-8 sm:-mb-12 transition-opacity duration-300"
            />
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-6 sm:pb-8">
          <div className="text-center mb-5 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold capitalize text-text-primary mb-1">
              {currentData.name}
            </h2>
            <div className="flex justify-center gap-2">
              {currentData.types.map((t) => (
                <span key={t.type.name} className={`px-3 py-1 rounded-lg text-xs font-bold text-white uppercase ${typeColors[t.type.name] || 'bg-gray-500'}`}>
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 bg-surface-secondary rounded-xl p-3 sm:p-4">
            <div className="text-center">
              <p className="text-text-tertiary text-xs uppercase font-bold">Altura</p>
              <p className="text-text-primary font-semibold text-lg">{currentData.height / 10} m</p>
            </div>
            <div className="text-center">
              <p className="text-text-tertiary text-xs uppercase font-bold">Peso</p>
              <p className="text-text-primary font-semibold text-lg">{currentData.weight / 10} kg</p>
            </div>
          </div>

          <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3">Base Stats</h3>
            {currentData.stats.map((stat) => (
              <div key={stat.stat.name} className="flex items-center gap-2 sm:gap-3">
                <span className="w-20 sm:w-24 text-[11px] sm:text-xs font-medium text-text-secondary uppercase text-right shrink-0">
                  {statLabels[stat.stat.name] || stat.stat.name}
                </span>
                <span className="w-7 sm:w-8 text-xs sm:text-sm font-bold text-text-primary text-right shrink-0">{stat.base_stat}</span>
                <div className="flex-1 h-2 sm:h-2.5 bg-surface-secondary rounded-full overflow-hidden" role="progressbar" aria-valuenow={stat.base_stat} aria-valuemin={0} aria-valuemax={150}>
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${getStatColor(stat.base_stat)}`}
                    style={{ width: `${getStatWidth(stat.base_stat)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-5 sm:pt-6 mb-5 sm:mb-6">
            <TypeMatchup types={currentData.types.map(t => t.type.name)} />
          </div>

          <div className="border-t border-border pt-5 sm:pt-6">
            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3 sm:mb-4 text-center">Cadeia Evolutiva</h3>
            <EvolutionChain
              pokemonId={currentData.id}
              onSelect={handleEvolutionClick}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
