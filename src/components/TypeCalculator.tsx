import { useState } from 'react';
import { calculateTypeEffectiveness, ALL_TYPES } from '../utils/typeEffectiveness';
import { Shield, Sword, ZapOff, Minus, RotateCcw } from 'lucide-react';

const TYPE_COLORS: Record<string, string> = {
    normal: "bg-gray-400", fire: "bg-red-500", water: "bg-blue-500",
    electric: "bg-yellow-400", grass: "bg-green-500", ice: "bg-cyan-300",
    fighting: "bg-orange-600", poison: "bg-purple-500", ground: "bg-yellow-600",
    flying: "bg-indigo-300", psychic: "bg-pink-500", bug: "bg-lime-500",
    rock: "bg-yellow-700", ghost: "bg-indigo-800", dragon: "bg-purple-600",
    dark: "bg-slate-700", steel: "bg-slate-400", fairy: "bg-pink-400"
};

export function TypeCalculator() {
    const [type1, setType1] = useState('normal');
    const [type2, setType2] = useState('none');

    const selectedTypes = type2 === 'none' ? [type1] : [type1, type2];
    const { weaknesses, resistances, immunities } = calculateTypeEffectiveness(selectedTypes);

    // Calcula tipos neutros (1x)

    const reset = () => { setType1('normal'); setType2('none'); };

    const TypeSelector = ({ label, value, onChange, isPrimary }: { label: string, value: string, onChange: (v: string) => void, isPrimary: boolean }) => (
        <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                {isPrimary ? <Shield size={14} /> : <Shield size={14} className="opacity-50" />}
                {label}
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-9 gap-1.5">
                {ALL_TYPES.map(type => (
                    <button
                        key={type}
                        onClick={() => onChange(type)}
                        className={`
              px-2 py-1.5 rounded-lg text-xs font-bold capitalize transition-all
              ${value === type
                                ? `${TYPE_COLORS[type]} text-white shadow-md scale-105 ring-2 ring-offset-1 ring-white dark:ring-slate-800`
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }
            `}
                    >
                        {type}
                    </button>
                ))}
                {!isPrimary && (
                    <button
                        onClick={() => onChange('none')}
                        className={`
              px-2 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1
              ${value === 'none'
                                ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-md scale-105'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }
            `}
                    >
                        <Minus size={12} /> Nenhum
                    </button>
                )}
            </div>
        </div>
    );

    const EffectivenessBadge = ({ type, multiplier }: { type: string, multiplier: number }) => {
        let color = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
        if (multiplier >= 2) color = 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800';
        else if (multiplier > 1) color = 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800';
        else if (multiplier < 1 && multiplier > 0) color = 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800';
        else if (multiplier === 0) color = 'bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-500';

        return (
            <div className={`flex flex-col items-center justify-center p-2 rounded-lg ${color} transition-all`}>
                <span className="text-[10px] font-bold uppercase opacity-70 mb-0.5">{type}</span>
                <span className="text-sm font-extrabold">{multiplier}x</span>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sword className="text-blue-500" /> Calculadora de Tipos
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Selecione os tipos defensivos para ver fraquezas, resistências e imunidades.
                    </p>
                </div>
                <button
                    onClick={reset}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                >
                    <RotateCcw size={16} /> Limpar
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
                <TypeSelector label="Tipo Principal" value={type1} onChange={setType1} isPrimary={true} />
                <TypeSelector label="Tipo Secundário (Opcional)" value={type2} onChange={setType2} isPrimary={false} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-100 dark:border-red-800/50">
                    <h3 className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2">
                        <ZapOff size={18} /> Fraquezas
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {weaknesses.map(w => (
                            <span key={w.type} className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${TYPE_COLORS[w.type] || 'bg-gray-500'}`}>
                                {w.type} ({w.multiplier}x)
                            </span>
                        ))}
                        {weaknesses.length === 0 && <span className="text-red-400/60 text-sm italic">Nenhuma fraqueza</span>}
                    </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800/50">
                    <h3 className="font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
                        <Shield size={18} /> Resistências
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {resistances.map(r => (
                            <span key={r.type} className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${TYPE_COLORS[r.type] || 'bg-gray-500'}`}>
                                {r.type} ({r.multiplier}x)
                            </span>
                        ))}
                        {resistances.length === 0 && <span className="text-green-400/60 text-sm italic">Nenhuma resistência</span>}
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                        <ZapOff size={18} className="rotate-45" /> Imunidades
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {immunities.map(i => (
                            <span key={i.type} className={`px-3 py-1 rounded-lg text-xs font-bold text-white ${TYPE_COLORS[i.type] || 'bg-gray-500'}`}>
                                {i.type} (0x)
                            </span>
                        ))}
                        {immunities.length === 0 && <span className="text-slate-400 text-sm italic">Nenhuma imunidade</span>}
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4 text-center">
                    Efetividade Completa vs Todos os Tipos
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
                    {ALL_TYPES.map(type => {
                        const mult = weaknesses.find(w => w.type === type)?.multiplier ||
                            resistances.find(r => r.type === type)?.multiplier ||
                            immunities.find(i => i.type === type)?.multiplier || 1;
                        return <EffectivenessBadge key={type} type={type} multiplier={mult} />;
                    })}
                </div>
            </div>
        </div>
    );
}