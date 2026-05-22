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

    // Calcular total de stats
    const total1 = p1.stats.reduce((acc, s) => acc + s.base_stat, 0);
    const total2 = p2.stats.reduce((acc, s) => acc + s.base_stat, 0);
    const winner = total1 > total2 ? p1 : total2 > total1 ? p2 : null;

    const getStatComparison = (val1: number, val2: number) => {
        if (val1 > val2) return { winner: 1, diff: val1 - val2, percent: ((val1 - val2) / val2 * 100).toFixed(1) };
        if (val2 > val1) return { winner: 2, diff: val2 - val1, percent: ((val2 - val1) / val1 * 100).toFixed(1) };
        return { winner: 0, diff: 0, percent: '0' };
    };

    const renderOverlappingBars = (statName: string, val1: number, val2: number, maxVal = 255) => {
        const comparison = getStatComparison(val1, val2);
        const width1 = (val1 / maxVal) * 100;
        const width2 = (val2 / maxVal) * 100;

        const statColorMap: Record<string, string> = {
            hp: 'bg-rose-500', attack: 'bg-orange-500', defense: 'bg-yellow-500',
            'special-attack': 'bg-blue-500', 'special-defense': 'bg-indigo-500', speed: 'bg-purple-500'
        };
        const barColor = statColorMap[statName] || 'bg-slate-500';

        return (
            <div className="mb-6 group">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-24">
                        {statName}
                    </span>

                    {/* Valores com destaque */}
                    <div className="flex items-center gap-3 flex-1 justify-end">
                        <span className={`text-lg font-bold w-12 text-right transition-all ${comparison.winner === 1 ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-slate-400 dark:text-slate-500'}`}>
                            {val1}
                        </span>

                        {/* Indicador de diferença */}
                        {comparison.winner !== 0 && (
                            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${comparison.winner === 1
                                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                                    : 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                                }`}>
                                {comparison.winner === 1 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                +{comparison.diff} ({comparison.percent}%)
                            </div>
                        )}
                        {comparison.winner === 0 && (
                            <span className="text-slate-400 dark:text-slate-500 text-xs">
                                <Minus size={12} />
                            </span>
                        )}

                        <span className={`text-lg font-bold w-12 text-right transition-all ${comparison.winner === 2 ? 'text-purple-600 dark:text-purple-400 scale-110' : 'text-slate-400 dark:text-slate-500'}`}>
                            {val2}
                        </span>
                    </div>
                </div>

                {/* Barras Sobrepostas */}
                <div className="relative h-10 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden shadow-inner">
                    {/* Barra Base (menor valor) */}
                    <div
                        className={`absolute top-0 left-0 h-full ${barColor} opacity-40 transition-all duration-700 ease-out`}
                        style={{ width: `${Math.max(width1, width2)}%` }}
                    />

                    {/* Barra Player 1 */}
                    <div
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700 ease-out flex items-center justify-end pr-2 ${comparison.winner === 1 ? 'opacity-100 shadow-lg shadow-blue-500/30' : 'opacity-80'
                            }`}
                        style={{ width: `${width1}%` }}
                    >
                        {comparison.winner === 1 && <Crown size={14} className="text-white drop-shadow-md" />}
                    </div>

                    {/* Barra Player 2 */}
                    <div
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-700 ease-out flex items-center justify-end pr-2 ${comparison.winner === 2 ? 'opacity-100 shadow-lg shadow-purple-500/30' : 'opacity-80'
                            }`}
                        style={{ width: `${width2}%` }}
                    >
                        {comparison.winner === 2 && <Crown size={14} className="text-white drop-shadow-md" />}
                    </div>

                    {/* Linha de empate visual */}
                    {comparison.winner === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white/50 dark:bg-black/50 px-3 py-1 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                EMPATE
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const modalContent = (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
            <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 border border-slate-200 dark:border-slate-700 max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                            <Trophy className="text-yellow-500" size={24} />
                            Comparativo Estratégico
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/50 dark:hover:bg-slate-700 rounded-full transition">
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>

                    {/* Total Stats */}
                    <div className="mt-4 flex justify-center gap-8">
                        <div className={`text-center px-6 py-3 rounded-xl transition-all ${total1 > total2 ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500 scale-105' : 'bg-slate-100 dark:bg-slate-700'}`}>
                            <p className="text-xs uppercase font-bold text-slate-400 mb-1">Total {p1.name}</p>
                            <p className={`text-2xl font-extrabold ${total1 > total2 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                {total1}
                            </p>
                        </div>
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-slate-300 dark:text-slate-600">VS</span>
                        </div>
                        <div className={`text-center px-6 py-3 rounded-xl transition-all ${total2 > total1 ? 'bg-purple-100 dark:bg-purple-900/40 ring-2 ring-purple-500 scale-105' : 'bg-slate-100 dark:bg-slate-700'}`}>
                            <p className="text-xs uppercase font-bold text-slate-400 mb-1">Total {p2.name}</p>
                            <p className={`text-2xl font-extrabold ${total2 > total1 ? 'text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                {total2}
                            </p>
                        </div>
                    </div>

                    {winner && (
                        <div className="mt-3 text-center">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-bold">
                                <Trophy size={14} />
                                {winner.name} tem vantagem geral!
                            </span>
                        </div>
                    )}
                </div>

                {/* Content Scrollable */}
                <div className="overflow-y-auto p-6 flex-1">
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        {/* Pokemon 1 */}
                        <div className="text-center space-y-4">
                            <div className="relative">
                                <div className="h-48 bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/10 rounded-2xl flex items-center justify-center p-4 border-2 border-blue-200 dark:border-blue-800">
                                    <img src={p1.sprites.other.dream_world.front_default || p1.sprites.front_default} className="h-40 object-contain drop-shadow-xl" />
                                </div>
                                {total1 > total2 && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                        Vencedor
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold capitalize text-blue-600 dark:text-blue-400">{p1.name}</h3>
                                <p className="text-slate-400 text-sm font-mono">#{String(p1.id).padStart(3, '0')}</p>
                                <div className="flex justify-center gap-1 mt-2">
                                    {p1.types.map(t => (
                                        <span key={t.type.name} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-[10px] font-bold uppercase">
                                            {t.type.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pokemon 2 */}
                        <div className="text-center space-y-4">
                            <div className="relative">
                                <div className="h-48 bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-900/10 rounded-2xl flex items-center justify-center p-4 border-2 border-purple-200 dark:border-purple-800">
                                    <img src={p2.sprites.other.dream_world.front_default || p2.sprites.front_default} className="h-40 object-contain drop-shadow-xl" />
                                </div>
                                {total2 > total1 && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                        Vencedor
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold capitalize text-purple-600 dark:text-purple-400">{p2.name}</h3>
                                <p className="text-slate-400 text-sm font-mono">#{String(p2.id).padStart(3, '0')}</p>
                                <div className="flex justify-center gap-1 mt-2">
                                    {p2.types.map(t => (
                                        <span key={t.type.name} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded text-[10px] font-bold uppercase">
                                            {t.type.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Comparison - Versão Premium */}
                    <div className="bg-slate-50 dark:bg-slate-700/30 p-6 rounded-2xl border border-slate-200 dark:border-slate-600">
                        <h4 className="text-center font-bold uppercase text-sm text-slate-400 mb-6 flex items-center justify-center gap-2">
                            <TrendingUp size={16} /> Análise de Base Stats
                        </h4>
                        {p1.stats.map((s, i) => {
                            const statNameMap: Record<string, string> = {
                                hp: 'HP', attack: 'Ataque', defense: 'Defesa',
                                'special-attack': 'Atq. Esp.', 'special-defense': 'Def. Esp.', speed: 'Velocidade'
                            };
                            const label = statNameMap[s.stat.name] || s.stat.name;
                            const val2 = p2.stats[i]?.base_stat || 0;
                            return renderOverlappingBars(label, s.base_stat, val2);
                        })}
                    </div>

                    {/* Physical Info */}
                    <div className="mt-6 grid grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Altura</p>
                                    <p className={`text-xl font-bold ${p1.height > p2.height ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                        {p1.height / 10}m
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Peso</p>
                                    <p className={`text-xl font-bold ${p1.weight > p2.weight ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                        {p1.weight / 10}kg
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 p-4 rounded-xl border border-purple-200 dark:border-purple-800">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Altura</p>
                                    <p className={`text-xl font-bold ${p2.height > p1.height ? 'text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                        {p2.height / 10}m
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Peso</p>
                                    <p className={`text-xl font-bold ${p2.weight > p1.weight ? 'text-purple-600 dark:text-purple-400' : 'text-slate-600 dark:text-slate-300'}`}>
                                        {p2.weight / 10}kg
                                    </p>
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