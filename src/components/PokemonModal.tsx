/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { PokemonDetail } from '../types/pokemon';
import { EvolutionChain } from './EvolutionChain';
import { TypeMatchup } from './TypeMatchup';
import { Play } from 'lucide-react';

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

const statLabels: Record<string, string> = {
  hp: 'HP', attack: 'Ataque', defense: 'Defesa',
  'special-attack': 'Atq. Esp.', 'special-defense': 'Def. Esp.', speed: 'Velocidade',
};

export function PokemonModal({ pokemon, onClose }: PokemonModalProps) {
  const [currentData, setCurrentData] = useState<PokemonDetail | null>(pokemon);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (pokemon) setCurrentData(pokemon);
  }, [pokemon]);

  const handleEvolutionClick = async (id: number) => {
    if (currentData?.id === id) return;
    setModalLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();
      setCurrentData(data);
    } catch (error) {
      console.error("Erro ao carregar evolução", error);
    } finally {
      setModalLoading(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!currentData) return null;

  const mainType = currentData.types[0]?.type.name || 'normal';
  const bgColor = typeColors[mainType] || 'bg-gray-500';

  const getStatWidth = (val: number) => Math.min((val / 150) * 100, 100);
  const getStatColor = (val: number) => {
    if (val >= 100) return 'bg-green-500';
    if (val >= 60) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* ✅ CARD COM SCROLL E ALTURA MÁXIMA */}
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Colorido - Ajustado altura e margem da imagem */}
        <div className={`relative h-40 ${bgColor} flex items-center justify-center transition-colors duration-500 shrink-0`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors z-10"
            aria-label="Fechar"
          >
            ✕
          </button>
          {/* Botão de Áudio */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (currentData.cries?.latest) {
                const audio = new Audio(currentData.cries.latest);
                audio.play();
              }
            }}
            className="absolute bottom-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors z-10"
            title="Tocar grito"
          >
            <Play size={18} fill="currentColor" />
          </button>

          {modalLoading ? (
            <div className="text-white font-bold animate-pulse">Carregando...</div>
          ) : (
            <img
              src={currentData.sprites.other.dream_world.front_default || currentData.sprites.front_default}
              alt={currentData.name}
              className="h-48 w-48 object-contain drop-shadow-2xl -mb-12 transition-opacity duration-300 z-0"
            />
          )}
        </div>

        {/* Conteúdo Rolável */}
        <div className="flex-1 overflow-y-auto pt-12 pb-8 px-8 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold capitalize text-slate-800 dark:text-white mb-1 transition-all">
              {currentData.name}
            </h2>
            <div className="flex justify-center gap-2">
              {currentData.types.map((t) => (
                <span key={t.type.name} className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase ${typeColors[t.type.name] || 'bg-gray-500'}`}>
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl transition-colors">
            <div className="text-center">
              <p className="text-slate-400 dark:text-slate-400 text-xs uppercase font-bold">Altura</p>
              <p className="text-slate-700 dark:text-slate-200 font-semibold">{currentData.height / 10} m</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 dark:text-slate-400 text-xs uppercase font-bold">Peso</p>
              <p className="text-slate-700 dark:text-slate-200 font-semibold">{currentData.weight / 10} kg</p>
            </div>
          </div>

          {/* Stats Bars */}
          <div className="space-y-3 mb-8">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-3">Base Stats</h3>
            {currentData.stats.map((stat) => (
              <div key={stat.stat.name} className="flex items-center gap-3">
                <span className="w-24 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase text-right">
                  {statLabels[stat.stat.name] || stat.stat.name}
                </span>
                <span className="w-8 text-xs font-bold text-slate-700 dark:text-slate-200">{stat.base_stat}</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getStatColor(stat.base_stat)}`}
                    style={{ width: `${getStatWidth(stat.base_stat)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Fraquezas & Resistências */}
          <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
            <TypeMatchup types={currentData.types.map(t => t.type.name)} />
          </div>

          {/* Evolução */}
          <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-2 text-center">Cadeia Evolutiva</h3>
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