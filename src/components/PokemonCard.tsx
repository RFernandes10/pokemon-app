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
    isComparing: boolean; // Novo
    onToggleCompare: () => void; // Novo
}

export function PokemonCard({ name, id, type, image, onClick, isFavorite, onToggleFavorite, isComparing, onToggleCompare }: PokemonCardProps) {
    const typeColors: Record<string, string> = {
        fire: "bg-red-500", water: "bg-blue-500", grass: "bg-green-500",
        electric: "bg-yellow-400", psychic: "bg-pink-500", ice: "bg-cyan-300",
        dragon: "bg-purple-600", normal: "bg-gray-400", fighting: "bg-orange-600",
        poison: "bg-purple-500", ground: "bg-yellow-600", flying: "bg-indigo-300",
        bug: "bg-lime-500", rock: "bg-yellow-700", ghost: "bg-indigo-800",
        steel: "bg-slate-400"
    };

    const bgColor = typeColors[type] || "bg-gray-500";

    return (
        <div
            onClick={onClick}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-md transition-all hover:-translate-y-2 hover:shadow-xl border border-slate-100 dark:border-slate-700 cursor-pointer"
        >
            <FavoriteButton isFavorite={isFavorite} onClick={onToggleFavorite} />

            {/* Botão de Comparar */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleCompare();
                }}
                className={`absolute bottom-3 right-3 p-2 rounded-full transition-all z-10 ${isComparing
                        ? 'bg-blue-500 text-white shadow-lg scale-110'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100'
                    }`}
                aria-label="Comparar Pokémon"
            >
                <Swords size={16} />
            </button>

            <div className={`absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full ${bgColor} opacity-20 blur-xl`} />

            <span className="absolute top-3 right-3 text-xs font-bold text-slate-400 dark:text-slate-500">
                #{String(id).padStart(3, '0')}
            </span>

            <div className="flex justify-center pt-8 pb-2">
                <img
                    src={image}
                    alt={name}
                    className="h-28 w-28 object-contain transition-transform group-hover:scale-110"
                />
            </div>

            <div className="p-4 text-center">
                <h3 className="mb-1 text-lg font-bold capitalize text-slate-800 dark:text-slate-100 truncate">
                    {name}
                </h3>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold text-white ${bgColor}`}>
                    {type}
                </span>
            </div>
        </div>
    );
}