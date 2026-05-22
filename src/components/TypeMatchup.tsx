/* eslint-disable @typescript-eslint/no-unused-vars */
import { calculateTypeEffectiveness, type TypeMatchup } from '../utils/typeEffectiveness';

// Cores dos tipos (mesma paleta do projeto)
const TYPE_COLORS: Record<string, string> = {
    normal: "bg-gray-400", fire: "bg-red-500", water: "bg-blue-500",
    electric: "bg-yellow-400", grass: "bg-green-500", ice: "bg-cyan-300",
    fighting: "bg-orange-600", poison: "bg-purple-500", ground: "bg-yellow-600",
    flying: "bg-indigo-300", psychic: "bg-pink-500", bug: "bg-lime-500",
    rock: "bg-yellow-700", ghost: "bg-indigo-800", dragon: "bg-purple-600",
    dark: "bg-slate-700", steel: "bg-slate-400", fairy: "bg-pink-400"
};

interface TypeMatchupProps {
    types: string[];
}

export function TypeMatchup({ types }: TypeMatchupProps) {
    const { weaknesses, resistances, immunities } = calculateTypeEffectiveness(types);

    if (weaknesses.length === 0 && resistances.length === 0 && immunities.length === 0) {
        return <p className="text-center text-sm text-slate-400 dark:text-slate-500 italic">Sem dados de efetividade.</p>;
    }

    const renderBadges = (list: TypeMatchup[], label: string, _colorClass: string) => (
        <div className="mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">{label}</h4>
            <div className="flex flex-wrap gap-2">
                {list.map(({ type, multiplier }) => (
                    <span
                        key={type}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white ${TYPE_COLORS[type] || 'bg-gray-500'} shadow-sm`}
                    >
                        <span className="capitalize">{type}</span>
                        <span className="bg-black/20 px-1.5 py-0.5 rounded text-[10px]">
                            {multiplier === 0 ? '0x' : `${multiplier}x`}
                        </span>
                    </span>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 transition-colors">
            {renderBadges(weaknesses, 'Fraquezas', 'text-red-600')}
            {renderBadges(resistances, 'Resistências', 'text-green-600')}
            {renderBadges(immunities, 'Imunidades', 'text-slate-600')}
        </div>
    );
}