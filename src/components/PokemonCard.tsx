import { Swords } from 'lucide-react';
import { FavoriteButton } from './FavoriteButton';

interface PokemonCardProps {
    name: string;
    id: number;
    type: string;
    image: string;
    onClick: () => void;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    isComparing: boolean;
    onToggleCompare: () => void;
    gradient: string;
}

const typeColors: Record<string, string> = {
    fire: "bg-red-500/10 text-red-600 dark:text-red-400", water: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    grass: "bg-green-500/10 text-green-600 dark:text-green-400", electric: "bg-yellow-400/10 text-yellow-600 dark:text-yellow-400",
    psychic: "bg-pink-500/10 text-pink-600 dark:text-pink-400", ice: "bg-cyan-300/10 text-cyan-600 dark:text-cyan-400",
    dragon: "bg-purple-600/10 text-purple-600 dark:text-purple-400", normal: "bg-gray-400/10 text-gray-600 dark:text-gray-400",
    fighting: "bg-orange-600/10 text-orange-600 dark:text-orange-400", poison: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    ground: "bg-yellow-600/10 text-yellow-600 dark:text-yellow-400", flying: "bg-indigo-300/10 text-indigo-600 dark:text-indigo-400",
    bug: "bg-lime-500/10 text-lime-600 dark:text-lime-400", rock: "bg-yellow-700/10 text-yellow-700 dark:text-yellow-500",
    ghost: "bg-indigo-800/10 text-indigo-700 dark:text-indigo-400", steel: "bg-slate-400/10 text-slate-600 dark:text-slate-400",
    fairy: "bg-pink-400/10 text-pink-600 dark:text-pink-400", dark: "bg-slate-700/10 text-slate-600 dark:text-slate-400",
};

const typeBgGradients: Record<string, string> = {
    fire: "from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/20",
    water: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/20",
    grass: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/20",
    electric: "from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/20",
    psychic: "from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/20",
    ice: "from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/20",
    dragon: "from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/20",
    normal: "from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/20",
    fighting: "from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/20",
    poison: "from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/20",
    ground: "from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/20",
    flying: "from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/20",
    bug: "from-lime-50 to-green-50 dark:from-lime-950/30 dark:to-green-950/20",
    rock: "from-stone-50 to-yellow-50 dark:from-stone-950/30 dark:to-yellow-950/20",
    ghost: "from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/20",
    steel: "from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/20",
    fairy: "from-pink-50 to-pink-50 dark:from-pink-950/30 dark:to-pink-950/20",
    dark: "from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/20",
};

export function PokemonCard({ name, id, type, image, onClick, isFavorite, onToggleFavorite, isComparing, onToggleCompare, gradient }: PokemonCardProps) {
    const bgGradient = typeBgGradients[type] || "from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/20";
    const chipColor = typeColors[type] || "bg-gray-500/10 text-gray-600";

    return (
        <div
            onClick={onClick}
            className="group relative overflow-hidden rounded-2xl bg-surface border border-border transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:border-border-hover cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
            aria-label={`${name}, Pokémon tipo ${type}`}
        >
            <FavoriteButton isFavorite={isFavorite} onClick={onToggleFavorite} />

            <button
                onClick={(e) => { e.stopPropagation(); onToggleCompare(); }}
                className={`absolute bottom-2.5 right-2.5 p-2 rounded-full transition-all duration-200 z-10 ${
                    isComparing
                        ? 'bg-brand-500 text-white shadow-lg scale-110'
                        : 'bg-surface/80 backdrop-blur-sm border border-border text-text-tertiary hover:text-brand-500 hover:border-brand-500/50 opacity-0 group-hover:opacity-100'
                }`}
                aria-label={`Comparar ${name}`}
            >
                <Swords size={14} />
            </button>

            <div className={`absolute top-0 right-0 w-32 h-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br ${gradient} opacity-[0.08] dark:opacity-[0.12] blur-2xl`} />

            <div className={`bg-gradient-to-b ${bgGradient} pt-6 sm:pt-8 pb-2 px-4 flex justify-center relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-b ${gradient} opacity-[0.03] dark:opacity-[0.06]`} />
                <span className="absolute top-3 right-3 text-[11px] font-bold text-text-tertiary font-mono select-none">
                    #{String(id).padStart(3, '0')}
                </span>
                <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    className="h-24 w-24 sm:h-28 sm:w-28 object-contain transition-all duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3 drop-shadow-lg"
                />
            </div>

            <div className="p-3 sm:p-4 text-center space-y-1.5 sm:space-y-2">
                <h3 className="text-sm sm:text-base font-bold capitalize text-text-primary truncate">
                    {name}
                </h3>
                <span className={`inline-block rounded-lg px-2.5 sm:px-3 py-1 text-[11px] sm:text-xs font-semibold ${chipColor}`}>
                    {type}
                </span>
            </div>
        </div>
    );
}
