import { useState, useEffect } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

interface EvolutionChain {
    name: string;
    id: number;
    isCurrent: boolean;
}

interface EvolutionChainProps {
    pokemonId: number;
    onSelect: (id: number) => void;
}

export function EvolutionChain({ pokemonId, onSelect }: EvolutionChainProps) {
    const [chain, setChain] = useState<EvolutionChain[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChain = async () => {
            setLoading(true);
            try {
                const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
                const speciesData = await speciesRes.json();
                const chainUrl = speciesData.evolution_chain.url;

                const chainRes = await fetch(chainUrl);
                const chainData = await chainRes.json();

                const evolutionList: EvolutionChain[] = [];

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const traverse = async (node: any) => {
                    const name = node.species.name;
                    // Usamos a URL padrão do sprite que é 100% garantida
                    const pokemonRes = await fetch(node.species.url);
                    const pokemonDetails = await pokemonRes.json();

                    evolutionList.push({
                        name,
                        id: pokemonDetails.id,
                        isCurrent: pokemonDetails.id === pokemonId,
                    });

                    if (node.evolves_to && node.evolves_to.length > 0) {
                        for (const evolution of node.evolves_to) {
                            await traverse(evolution);
                        }
                    }
                };

                await traverse(chainData.chain);
                setChain(evolutionList);
            } catch (error) {
                console.error("Erro ao buscar evolução:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChain();
    }, [pokemonId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-24 text-slate-400 dark:text-slate-500">
                <Loader2 className="animate-spin mr-2" size={16} />
                Carregando evolução...
            </div>
        );
    }

    if (chain.length <= 1) {
        return (
            <div className="text-center text-sm text-slate-400 dark:text-slate-500 italic py-4">
                Este Pokémon não possui evolução conhecida.
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 px-2 scrollbar-hide">
            {chain.map((poke, index) => (
                <div key={poke.id} className="flex items-center shrink-0">
                    <button
                        onClick={() => onSelect(poke.id)}
                        className={`
              flex flex-col items-center gap-1 p-2 rounded-xl transition-all
              ${poke.isCurrent
                                ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500 scale-105'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800 opacity-60 hover:opacity-100'
                            }
            `}
                    >
                        {/* ✅ URL CORRIGIDA PARA PNG PADRÃO */}
                        <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png`}
                            alt={poke.name}
                            className="w-14 h-14 object-contain"
                        />
                        <span className={`
              text-[10px] font-bold capitalize
              ${poke.isCurrent ? 'text-blue-700 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400'}
            `}>
                            {poke.name}
                        </span>
                    </button>

                    {index < chain.length - 1 && (
                        <div className="mx-1 text-slate-300 dark:text-slate-600">
                            <ArrowRight size={16} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}