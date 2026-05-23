import { createPortal } from 'react-dom';
import { X, Trophy, TrendingUp, TrendingDown, Minus, Crown } from 'lucide-react';
import type { PokemonDetail } from '../types/pokemon';

interface CompareViewProps {
    list: PokemonDetail[];
    onClose: () => void;
}

export function CompareView({ list, onClose }: CompareViewProps) {
    if (list.length < 2) return null;

    const [p1, p2] = list;
    const total1 = p1.stats.reduce((acc, s) => acc + s.base_stat, 0);
    const total2 = p2.stats.reduce((acc, s) => acc + s.base_stat, 0);
    const winner = total1 > total2 ? p1 : total2 > total1 ? p2 : null;

    const getStatComparison = (val1: number, val2: number) => {
        if (val1 > val2) return { winner: 1, diff: val1 - val2, percent: ((val1 - val2) / Math.max(val2, 1) * 100).toFixed(1) };
        if (val2 > val1) return { winner: 2, diff: val2 - val1, percent: ((val2 - val1) / Math.max(val1, 1) * 100).toFixed(1) };
        return { winner: 0, diff: 0, percent: '0' };
    };

    const statNameMap: Record<string, string> = {
        hp: 'HP', attack: 'Ataque', defense: 'Defesa',
        'special-attack': 'Atq. Esp.', 'special-defense': 'Def. Esp.', speed: 'Velocidade'
    };

    const renderOverlappingBars = (statName: string, val1: number, val2: number, maxVal = 255) => {
        const comparison = getStatComparison(val1, val2);
        const width1 = (val1 / maxVal) * 100;
        const width2 = (val2 / maxVal) * 100;

        return (
            <div className="mb-4 sm:mb-6 group">
                <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-text-secondary w-16 sm:w-24 shrink-0">
                        {statName}
                    </span>
                    <div className="flex items-center gap-1.5 sm:gap-3 flex-1 justify-end">
                        <span className={`text-sm sm:text-lg font-bold w-10 sm:w-12 text-right transition-all ${comparison.winner === 1 ? 'text-brand-600 dark:text-brand-400 scale-110' : 'text-text-tertiary'}`}>
                            {val1}
                        </span>
                        {comparison.winner !== 0 ? (
                            <div className={`hidden sm:flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                comparison.winner === 1
                                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                                    : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                            }`}>
                                {comparison.winner === 1 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                +{comparison.diff}
                            </div>
                        ) : (
                            <span className="hidden sm:block text-text-tertiary"><Minus size={12} /></span>
                        )}
                        <span className={`text-sm sm:text-lg font-bold w-10 sm:w-12 text-right transition-all ${comparison.winner === 2 ? 'text-purple-600 dark:text-purple-400 scale-110' : 'text-text-tertiary'}`}>
                            {val2}
                        </span>
                    </div>
                </div>
                <div className="relative h-8 sm:h-10 bg-surface-secondary rounded-xl overflow-hidden shadow-inner">
                    <div className={`absolute top-0 left-0 h-full bg-gradient-to-r from-slate-400 to-slate-300 dark:from-slate-600 dark:to-slate-500 opacity-30 transition-all duration-700 ease-out`}
                        style={{ width: `${Math.max(width1, width2)}%` }} />
                    <div className={`absolute top-0 left-0 h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-700 ease-out flex items-center justify-end pr-1.5 sm:pr-2 ${comparison.winner === 1 ? 'opacity-100 shadow-lg shadow-brand-500/30' : 'opacity-70'}`}
                        style={{ width: `${width1}%` }}>
                        {comparison.winner === 1 && <Crown size={12} className="text-white drop-shadow-md" />}
                    </div>
                    <div className={`absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-700 ease-out flex items-center justify-end pr-1.5 sm:pr-2 ${comparison.winner === 2 ? 'opacity-100 shadow-lg shadow-purple-500/30' : 'opacity-70'}`}
                        style={{ width: `${width2}%` }}>
                        {comparison.winner === 2 && <Crown size={12} className="text-white drop-shadow-md" />}
                    </div>
                    {comparison.winner === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-surface/60 dark:bg-slate-900/60 px-2 py-0.5 rounded-full text-[10px] font-bold text-text-tertiary">
                                EMPATE
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const modalContent = (
        <div
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Comparativo de Pokémon"
        >
            <div className="relative w-full sm:max-w-4xl bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-slide-up sm:animate-scale-in border border-border max-h-[92vh] sm:max-h-[90vh] flex flex-col">
                <div className="p-4 sm:p-6 border-b border-border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <div className="flex justify-between items-center mb-3 sm:mb-4">
                        <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2 text-text-primary">
                            <Trophy className="text-yellow-500" size={20} />
                            Comparativo
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-surface-hover rounded-full transition" aria-label="Fechar">
                            <X size={18} className="text-text-secondary" />
                        </button>
                    </div>

                    <div className="flex justify-center gap-3 sm:gap-8">
                        <div className={`text-center px-3 sm:px-6 py-2 sm:py-3 rounded-xl transition-all flex-1 sm:flex-none ${total1 > total2 ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-brand-500 scale-105' : 'bg-surface-secondary'}`}>
                            <p className="text-[10px] sm:text-xs uppercase font-bold text-text-tertiary mb-0.5 sm:mb-1 truncate max-w-[100px] sm:max-w-none">{p1.name}</p>
                            <p className={`text-lg sm:text-2xl font-extrabold ${total1 > total2 ? 'text-brand-600 dark:text-brand-400' : 'text-text-secondary'}`}>{total1}</p>
                        </div>
                        <div className="flex items-center">
                            <span className="text-lg sm:text-2xl font-bold text-text-tertiary">VS</span>
                        </div>
                        <div className={`text-center px-3 sm:px-6 py-2 sm:py-3 rounded-xl transition-all flex-1 sm:flex-none ${total2 > total1 ? 'bg-purple-100 dark:bg-purple-900/40 ring-2 ring-purple-500 scale-105' : 'bg-surface-secondary'}`}>
                            <p className="text-[10px] sm:text-xs uppercase font-bold text-text-tertiary mb-0.5 sm:mb-1 truncate max-w-[100px] sm:max-w-none">{p2.name}</p>
                            <p className={`text-lg sm:text-2xl font-extrabold ${total2 > total1 ? 'text-purple-600 dark:text-purple-400' : 'text-text-secondary'}`}>{total2}</p>
                        </div>
                    </div>

                    {winner && (
                        <div className="mt-2 sm:mt-3 text-center">
                            <span className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1 sm:py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs sm:text-sm font-bold">
                                <Trophy size={12} />
                                {winner.name} tem vantagem geral!
                            </span>
                        </div>
                    )}
                </div>

                <div className="overflow-y-auto p-4 sm:p-6 flex-1">
                    <div className="grid grid-cols-2 gap-3 sm:gap-6 mb-6 sm:mb-8">
                        {[p1, p2].map((p, idx) => (
                            <div key={p.id} className="text-center space-y-2 sm:space-y-4">
                                <div className="relative">
                                    <div className={`h-32 sm:h-48 bg-gradient-to-b ${idx === 0 ? 'from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-950/10' : 'from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-950/10'} rounded-xl sm:rounded-2xl flex items-center justify-center p-3 sm:p-4 border-2 ${idx === 0 ? 'border-blue-200 dark:border-blue-800' : 'border-purple-200 dark:border-purple-800'}`}>
                                        <img src={p.sprites.other.dream_world.front_default || p.sprites.front_default} className="h-24 sm:h-40 object-contain drop-shadow-xl" alt={p.name} />
                                    </div>
                                    {(total1 > total2 && idx === 0) || (total2 > total1 && idx === 1) ? (
                                        <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg whitespace-nowrap">
                                            Vencedor
                                        </div>
                                    ) : null}
                                </div>
                                <div>
                                    <h3 className={`text-lg sm:text-2xl font-bold capitalize ${idx === 0 ? 'text-brand-600 dark:text-brand-400' : 'text-purple-600 dark:text-purple-400'}`}>
                                        {p.name}
                                    </h3>
                                    <p className="text-text-tertiary text-xs sm:text-sm font-mono">#{String(p.id).padStart(3, '0')}</p>
                                    <div className="flex justify-center gap-1 mt-1 sm:mt-2">
                                        {p.types.map(t => (
                                            <span key={t.type.name} className={`px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase ${
                                                idx === 0
                                                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                                                    : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                                            }`}>
                                                {t.type.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-surface-secondary p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-border">
                        <h4 className="text-center font-bold uppercase text-xs sm:text-sm text-text-tertiary mb-4 sm:mb-6 flex items-center justify-center gap-2">
                            <TrendingUp size={14} className="sm:size-[16px]" /> Análise de Stats
                        </h4>
                        {p1.stats.map((s) => {
                            const label = statNameMap[s.stat.name] || s.stat.name;
                            const val2 = p2.stats.find(st => st.stat.name === s.stat.name)?.base_stat || 0;
                            return renderOverlappingBars(label, s.base_stat, val2);
                        })}
                    </div>

                    <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-950/10 p-3 sm:p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
                                <div>
                                    <p className="text-[10px] sm:text-xs text-text-tertiary uppercase font-bold mb-0.5 sm:mb-1">Altura</p>
                                    <p className={`text-base sm:text-xl font-bold ${p1.height > p2.height ? 'text-brand-600 dark:text-brand-400' : 'text-text-secondary'}`}>{p1.height / 10}m</p>
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-text-tertiary uppercase font-bold mb-0.5 sm:mb-1">Peso</p>
                                    <p className={`text-base sm:text-xl font-bold ${p1.weight > p2.weight ? 'text-brand-600 dark:text-brand-400' : 'text-text-secondary'}`}>{p1.weight / 10}kg</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-950/10 p-3 sm:p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                            <div className="grid grid-cols-2 gap-2 sm:gap-4 text-center">
                                <div>
                                    <p className="text-[10px] sm:text-xs text-text-tertiary uppercase font-bold mb-0.5 sm:mb-1">Altura</p>
                                    <p className={`text-base sm:text-xl font-bold ${p2.height > p1.height ? 'text-purple-600 dark:text-purple-400' : 'text-text-secondary'}`}>{p2.height / 10}m</p>
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-text-tertiary uppercase font-bold mb-0.5 sm:mb-1">Peso</p>
                                    <p className={`text-base sm:text-xl font-bold ${p2.weight > p1.weight ? 'text-purple-600 dark:text-purple-400' : 'text-text-secondary'}`}>{p2.weight / 10}kg</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
