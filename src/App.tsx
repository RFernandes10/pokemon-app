import { useState, useMemo } from 'react';
import { usePokemonList } from './hooks/usePokemonList';
import { useFavorites } from './hooks/useFavorites';
import { useTheme } from './hooks/useTheme';
import { useComparison } from './hooks/useComparison';
import { PokemonCard } from './components/PokemonCard';
import { SearchBar } from './components/SearchBar';
import { SkeletonCard } from './components/SkeletonCard';
import { Pagination } from './components/Pagination';
import { PokemonModal } from './components/PokemonModal';
import { TypeFilter } from './components/TypeFilter';
import { ThemeToggle } from './components/ThemeToggle';
import { TypeCalculator } from './components/TypeCalculator';
import { CompareView } from './components/CompareView';
import { IntroScreen } from './components/IntroScreen';
import type { PokemonDetail } from './types/pokemon';
import { Heart, Filter, Calculator, List, Swords, X, PlayCircle } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

function App() {
  // Hooks
  const { data: pokemons, loading, error } = usePokemonList();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const { compareList, toggleCompare, clearCompare, isComparing } = useComparison();

  // ✅ LÓGICA DA INTRO: Inicializa baseado no localStorage, mas permite reabrir
  const [showIntro, setShowIntro] = useState(() => {
    return localStorage.getItem('pokedex-intro-seen') !== 'true';
  });

  // Estados da interface
  const [activeTab, setActiveTab] = useState<'pokedex' | 'calculator'>('pokedex');
  const [showCompare, setShowCompare] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(null);

  // Resetar página quando filtros mudam
  useMemo(() => {
    // eslint-disable-next-line react-hooks/set-state-in-render
    setCurrentPage(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedType, showOnlyFavorites]);

  // Filtragem
  const filteredPokemons = useMemo(() => {
    return pokemons.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || p.types.some(t => t.type.name === selectedType);
      const matchesFavorites = !showOnlyFavorites || favorites.includes(p.id);
      return matchesSearch && matchesType && matchesFavorites;
    });
  }, [pokemons, searchTerm, selectedType, showOnlyFavorites, favorites]);

  const totalPages = Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE);
  const paginatedPokemons = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPokemons.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPokemons, currentPage]);

  const isNoResults = !loading && filteredPokemons.length === 0;
  const isFavoritesEmpty = showOnlyFavorites && favorites.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 font-sans transition-colors duration-300 relative pb-20">
      {/* 🎬 Tela de Introdução (Controlada pelo estado) */}
      {showIntro && <IntroScreen onClose={() => setShowIntro(false)} />}


      {/* 🔧 Barra Superior de Controles - Agrupa Theme e Intro */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        {/* Botão Reabertura */}
        <button
          onClick={() => setShowIntro(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-linear-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white font-semibold shadow-lg hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all"
          title="Assistir Abertura Novamente"
        >
          <PlayCircle size={18} />
          <span className="hidden sm:inline">Abertura</span>
        </button>

        {/* Theme Toggle - REMOVA o posicionamento fixed dele */}
        <div className="relative">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </div>

      <header className="mb-8 text-center mt-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-3">
          <span className="text-blue-500 dark:text-blue-400">🎮</span>
          Pokédex Pro
        </h1>

        <div className="mt-6 flex justify-center">
          <div className="inline-flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('pokedex')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'pokedex' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <List size={16} /> Pokédex
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'calculator' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Calculator size={16} /> Calculadora
            </button>
          </div>
        </div>
      </header>

      {activeTab === 'pokedex' ? (
        <>
          <div className="max-w-7xl mx-auto space-y-4 mb-8">
            <SearchBar onSearch={setSearchTerm} />
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <TypeFilter selectedType={selectedType} onTypeChange={setSelectedType} />
              <button
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${showOnlyFavorites ? 'bg-red-500 dark:bg-red-600 text-white shadow-lg shadow-red-500/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
              >
                <Heart size={16} fill={showOnlyFavorites ? 'currentColor' : 'none'} />
                {showOnlyFavorites ? 'Mostrando Favoritos' : 'Apenas Favoritos'}
              </button>
            </div>
          </div>

          {error && (
            <div className="max-w-7xl mx-auto rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-center text-red-600 dark:text-red-400 mb-6 border border-red-100 dark:border-red-800">
              ⚠️ {error}
            </div>
          )}

          <main className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 max-w-7xl mx-auto min-h-100">
            {loading ? (
              Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
            ) : !isNoResults ? (
              paginatedPokemons.map((poke) => (
                <PokemonCard
                  key={poke.id}
                  id={poke.id}
                  name={poke.name}
                  type={poke.types[0]?.type.name || 'normal'}
                  image={poke.sprites.other.dream_world.front_default || poke.sprites.front_default}
                  isFavorite={isFavorite(poke.id)}
                  onToggleFavorite={() => toggleFavorite(poke.id)}
                  onClick={() => setSelectedPokemon(poke)}
                  isComparing={isComparing(poke.id)}
                  onToggleCompare={() => toggleCompare(poke)}
                />
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${isFavoritesEmpty ? 'bg-red-50 dark:bg-red-900/20 text-red-400 dark:text-red-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>
                  <Heart size={36} />
                </div>
                <h3 className="text-slate-700 dark:text-slate-200 font-semibold text-lg mb-1">
                  {isFavoritesEmpty ? 'Nenhum favorito ainda' : 'Nenhum Pokémon encontrado'}
                </h3>
                <button
                  onClick={() => { setSearchTerm(''); setSelectedType('all'); setShowOnlyFavorites(false); }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg"
                >
                  <Filter size={18} /> Limpar filtros
                </button>
              </div>
            )}
          </main>

          {!loading && filteredPokemons.length > 0 && (
            <>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              <p className="text-center text-sm text-slate-400 dark:text-slate-500 mt-4">
                Página {currentPage} de {totalPages} • Mostrando {paginatedPokemons.length} Pokémon
              </p>
            </>
          )}

          {selectedPokemon && (
            <PokemonModal
              pokemon={selectedPokemon}
              onClose={() => setSelectedPokemon(null)}
              onPokemonChange={setSelectedPokemon}
            />
          )}
        </>
      ) : (
        <TypeCalculator />
      )}

      {/* Barra Flutuante de Comparação */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-800 rounded-full shadow-2xl border border-slate-200 dark:border-slate-700 p-2 flex items-center gap-2 animate-in slide-in-from-bottom-10 duration-300">
          <div className="flex items-center gap-2 px-3">
            <Swords size={18} className="text-blue-500" />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {compareList.length}/2 Selecionados
            </span>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
          {compareList.map(p => (
            <div key={p.id} className="relative group">
              <img src={p.sprites.other.dream_world.front_default || p.sprites.front_default} className="w-10 h-10 object-contain" />
              <button
                onClick={() => toggleCompare(p)}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setShowCompare(true)}
            disabled={compareList.length < 2}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${compareList.length >= 2
              ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
          >
            Comparar
          </button>
          <button onClick={clearCompare} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-400">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Modal de Comparação */}
      {showCompare && (
        <CompareView list={compareList} onClose={() => setShowCompare(false)} />
      )}
    </div>
  );
}

export default App;