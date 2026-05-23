import {
    Circle, Flame, Droplets, Leaf, Zap, Snowflake, Ghost,
    Mountain, Wind, Bug, Gem, Shield, Swords, Skull, Sparkles, Footprints,
} from 'lucide-react';

interface TypeFilterProps {
    selectedType: string;
    onTypeChange: (type: string) => void;
}

const types = [
    { name: 'all', label: 'Todos', icon: Circle, color: 'bg-slate-500' },
    { name: 'fire', label: 'Fogo', icon: Flame, color: 'bg-red-500' },
    { name: 'water', label: 'Água', icon: Droplets, color: 'bg-blue-500' },
    { name: 'grass', label: 'Grama', icon: Leaf, color: 'bg-green-500' },
    { name: 'electric', label: 'Elétrico', icon: Zap, color: 'bg-yellow-400' },
    { name: 'psychic', label: 'Psíquico', icon: Sparkles, color: 'bg-pink-500' },
    { name: 'ice', label: 'Gelo', icon: Snowflake, color: 'bg-cyan-300' },
    { name: 'dragon', label: 'Dragão', icon: Footprints, color: 'bg-purple-600' },
    { name: 'fighting', label: 'Lutador', icon: Swords, color: 'bg-orange-600' },
    { name: 'poison', label: 'Venenoso', icon: Skull, color: 'bg-purple-500' },
    { name: 'ground', label: 'Terra', icon: Mountain, color: 'bg-yellow-600' },
    { name: 'flying', label: 'Voador', icon: Wind, color: 'bg-indigo-300' },
    { name: 'bug', label: 'Inseto', icon: Bug, color: 'bg-lime-500' },
    { name: 'rock', label: 'Pedra', icon: Gem, color: 'bg-yellow-700' },
    { name: 'ghost', label: 'Fantasma', icon: Ghost, color: 'bg-indigo-800' },
    { name: 'steel', label: 'Aço', icon: Shield, color: 'bg-slate-400' },
];

export function TypeFilter({ selectedType, onTypeChange }: TypeFilterProps) {
    return (
        <div className="-mx-4 sm:mx-0 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-2 px-4 sm:px-0 min-w-max sm:min-w-0 sm:flex-wrap">
                {types.map((type) => {
                    const Icon = type.icon;
                    const isActive = selectedType === type.name;

                    return (
                        <button
                            key={type.name}
                            onClick={() => onTypeChange(type.name)}
                            className={`
                                flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl font-medium text-xs sm:text-sm
                                transition-all duration-200 hover:scale-105 active:scale-95 whitespace-nowrap
                                ${isActive
                                    ? `${type.color} text-white shadow-lg scale-105`
                                    : 'bg-surface border border-border text-text-secondary hover:bg-surface-hover hover:border-border-hover'
                                }
                            `}
                            aria-pressed={isActive}
                        >
                            <Icon size={14} className="sm:size-[16px]" strokeWidth={2.5} />
                            <span>{type.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
