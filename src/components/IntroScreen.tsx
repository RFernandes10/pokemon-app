import { useState } from 'react';
import { Play, X, Tv, Zap } from 'lucide-react';
import ashHat from '../assets/icons/ash-hat.png';
import pokedexIcon from '../assets/icons/pokedex.png';
import backpackIcon from '../assets/icons/backpack.png';
import pokeballIcon from '../assets/icons/pokeball.png';

interface IntroScreenProps {
  onClose: () => void;
}

const POKEBALL_COLORS = [
  { type: 'fire', color: 'from-red-500 to-orange-500', glow: 'shadow-red-500/50' },
  { type: 'water', color: 'from-blue-500 to-cyan-500', glow: 'shadow-blue-500/50' },
  { type: 'grass', color: 'from-green-500 to-emerald-500', glow: 'shadow-green-500/50' },
  { type: 'electric', color: 'from-yellow-400 to-amber-500', glow: 'shadow-yellow-500/50' },
  { type: 'psychic', color: 'from-pink-500 to-rose-500', glow: 'shadow-pink-500/50' },
  { type: 'ice', color: 'from-cyan-300 to-blue-400', glow: 'shadow-cyan-500/50' },
];

export function IntroScreen({ onClose }: IntroScreenProps) {
  // eslint-disable-next-line no-empty-pattern
  const [] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  const handleClose = () => {
    setAnimateOut(true);
    setTimeout(() => {
      localStorage.setItem('pokedex-intro-seen', 'true');
      onClose();
    }, 500);
  };

  const handleWatchOpening = () => {
    window.open('https://www.youtube.com/watch?v=mE8E3nT2U70', '_blank');
  };

  return (
    <div className={`fixed inset-0 z-100 bg-linear-to-br from-red-600 via-blue-600 to-indigo-700 flex items-center justify-center overflow-hidden transition-all duration-500 ${animateOut ? 'opacity-0 scale-110' : 'opacity-100'}`}>
      {/* Background Animado - Pokébolas Flutuantes */}
      <div className="absolute inset-0 overflow-hidden">
        {POKEBALL_COLORS.map((ball, i) => (
          <div
            key={ball.type}
            className={`absolute animate-pulse`}
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '3s',
            }}
          >
            <div className={`w-24 h-24 rounded-full bg-linear-to-br ${ball.color} shadow-2xl ${ball.glow} flex items-center justify-center relative`}>
              <div className="absolute w-full h-2 bg-white/30 top-1/2 -translate-y-1/2" />
              <div className="w-8 h-8 bg-white rounded-full border-4 border-slate-800 shadow-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Partículas de Luz */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

      {/* Conteúdo Principal */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Logo Pokémon */}
        <div className="mb-8 animate-bounce">
          <h1 className="text-6xl md:text-8xl font-extrabold text-white drop-shadow-2xl tracking-tighter">
            POKÉ<span className="text-yellow-400">DEX</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mt-2 font-bold tracking-widest uppercase">
            Pro Edition
          </p>
        </div>

        {/* Elementos do Ash */}
<div className="flex justify-center gap-4 mb-8">
  {/* Chapéu do Ash - Versão com imagem REAL */}
  <div className="relative group">
    <img 
      src={ashHat}
      alt="Chapéu do Ash"
      className="w-20 h-20 object-contain drop-shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
    />
    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/80 font-bold whitespace-nowrap">
      Chapéu
    </span>
  </div>

  {/* Pokédex - Versão com imagem REAL */}
  <div className="relative group">
    <img 
      src={pokedexIcon}
      alt="Pokédex"
      className="w-20 h-20 object-contain drop-shadow-2xl transform group-hover:scale-110 transition-all duration-300"
    />
    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/80 font-bold whitespace-nowrap">
      Pokédex
    </span>
  </div>

  {/* Mochila - Versão com imagem REAL */}
  <div className="relative group">
    <img 
      src={backpackIcon}
      alt="Mochila"
      className="w-20 h-20 object-contain drop-shadow-2xl transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300"
    />
    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/80 font-bold whitespace-nowrap">
      Mochila
    </span>
  </div>

  {/* Pokébolas - Versão com imagem REAL */}
  <div className="relative group">
    <img 
      src={pokeballIcon}
      alt="Pokébolas"
      className="w-20 h-20 object-contain drop-shadow-2xl transform group-hover:scale-110 group-hover:rotate-180 transition-all duration-700"
    />
    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/80 font-bold whitespace-nowrap">
      Pokébolas
    </span>
  </div>
</div>

        {/* Frase do Ash */}
        <div className="mb-8 mt-12">
          <p className="text-lg md:text-xl text-white/95 font-bold italic mb-2">
            "Eu escolho você!"
          </p>
          <p className="text-sm text-white/70 font-medium">
            — Ash Ketchum de Pallet Town
          </p>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleClose}
            className="group relative px-8 py-4 bg-linear-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-2xl shadow-2xl hover:scale-105 transition-all flex items-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform" />
            <Zap size={24} className="relative" />
            <span className="relative text-lg">Iniciar Jornada</span>
          </button>

          <button
            onClick={handleWatchOpening}
            className="group px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 transition-all flex items-center gap-3"
          >
            <Tv size={24} />
            <span className="text-lg">Assistir Abertura</span>
            <Play size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Stats Rápidos */}
        <div className="mt-12 grid grid-cols-3 gap-6 text-white/80">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-400">151</p>
            <p className="text-xs uppercase tracking-wider">Pokémon</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">18</p>
            <p className="text-xs uppercase tracking-wider">Tipos</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">∞</p>
            <p className="text-xs uppercase tracking-wider">Aventuras</p>
          </div>
        </div>
      </div>

      {/* Botão Fechar */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all"
      >
        <X size={24} />
      </button>

      {/* Decoração Inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black/30 to-transparent" />
    </div>
  );
}