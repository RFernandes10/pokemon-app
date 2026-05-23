import { useState, useMemo, useCallback, useEffect } from 'react';
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
import { Heart, Filter, Calculator, List, Swords, X, PlayCircle, ChevronDown } from 'lucide-react';

const ITEMS_PER_PAGE = 20;

const typeGradients: Record<string, string> = {
  fire: 'from-red-500 to-orange-500',
  water: 'from-blue-500 to-cyan-500',
  grass: 'from-green-500 to-emerald-500',
  electric: 'from-yellow-400 to-amber-500',
  psychic: 'from-pink-500 to-rose-500',
  ice: 'from-cyan-300 to-blue-400',
  dragon: 'from-purple-600 to-indigo-600',
  normal: 'from-gray-400 to-slate-400',
  fighting: 'from-orange-600 to-red-600',
  poison: 'from-purple-500 to-violet-500',
  ground: 'from-yellow-600 to-amber-700',
  flying: 'from-indigo-300 to-blue-500',
  bug: 'from-lime-500 to-green-500',
  rock: 'from-yellow-700 to-stone-600',
  ghost: 'from-indigo-800 to-purple-700',
  steel: 'from-slate-400 to-gray-500',
  fairy: 'from-pink-400 to-pink-600',
  dark: 'from-slate-700 to-gray-800',
};

function App() {
  const { data: pokemons, loading, error } = usePokemonList();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { theme, toggleTheme } = useTheme();
  const { compareList, toggleCompare, clearCompare, isComparing } = useComparison();

  const [showIntro, setShowIntro] = useState(() => localStorage.getItem('pokedex-intro-seen') !== 'true');
  const [activeTab, setActiveTab] = useState<'pokedex' | 'calculator'>('pokedex');
  const [showCompare, setShowCompare] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, showOnlyFavorites]);

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

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedType('all');
    setShowOnlyFavorites(false);
    setCurrentPage(1);
  }, []);

  return (
    <>
      {showIntro && <IntroScreen onClose={() => setShowIntro(false)} />}

      <div className="min-h-screen bg-surface text-text-primary transition-colors duration-300 relative pb-24 lg:pb-20">
        <div className="fixed top-3 right-3 sm:top-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowIntro(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 hover:scale-105 active:scale-95 transition-all"
            aria-label="Assistir Abertura Novamente"
          >
            <PlayCircle size={16} className="sm:size-[18px]" />
            <span className="hidden sm:inline">Abertura</span>
          </button>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>

        <header className="pt-12 sm:pt-16 pb-6 sm:pb-8 text-center container-px">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary flex items-center justify-center gap-3">
            <span className="bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
              Pokédex
            </span>
            <span className="text-text-primary">Pro</span>
          </h1>

          <p className="mt-2 text-sm sm:text-base text-text-secondary max-w-md mx-auto">
            Explore os 151 Pokémon da região de Kanto
          </p>

          <div className="mt-4 sm:mt-6 flex justify-center">
            <div className="inline-flex bg-surface-secondary p-1 rounded-xl border border-border">
              <button
                onClick={() => setActiveTab('pokedex')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'pokedex'
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                aria-pressed={activeTab === 'pokedex'}
              >
                <List size={16} /> Pokédex
              </button>
              <button
                onClick={() => setActiveTab('calculator')}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'calculator'
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
                aria-pressed={activeTab === 'calculator'}
              >
                <Calculator size={16} /> Calculadora
              </button>
            </div>
          </div>
        </header>

        {activeTab === 'pokedex' ? (
          <div className="animate-fade-in">
            <div className="container-px max-w-7xl mx-auto space-y-4 mb-6 sm:mb-8">
              <SearchBar onSearch={setSearchTerm} />

              <div className="hidden sm:block">
                <TypeFilter selectedType={selectedType} onTypeChange={setSelectedType} />
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-medium text-text-secondary hover:bg-surface-hover transition-all"
                  aria-expanded={showMobileFilters}
                  aria-label="Filtrar por tipo"
                >
                  <Filter size={16} /> Tipo <ChevronDown size={14} className={`transition-transform ${showMobileFilters ? 'rotate-180' : ''}`} />
                </button>

                <div className="flex items-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      showOnlyFavorites
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                        : 'bg-surface border border-border text-text-secondary hover:bg-surface-hover'
                    }`}
                    aria-pressed={showOnlyFavorites}
                  >
                    <Heart size={16} fill={showOnlyFavorites ? 'currentColor' : 'none'} />
                    <span className="hidden xs:inline">{showOnlyFavorites ? 'Favoritos' : 'Favoritos'}</span>
                  </button>

                  {(searchTerm || selectedType !== 'all' || showOnlyFavorites) && (
                    <button
                      onClick={handleClearFilters}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-surface border border-border text-text-tertiary hover:text-text-secondary hover:bg-surface-hover transition-all text-sm"
                      aria-label="Limpar filtros"
                    >
                      <X size={16} />
                      <span className="hidden sm:inline">Limpar</span>
                    </button>
                  )}
                </div>
              </div>

              {showMobileFilters && (
                <div className="sm:hidden animate-slide-up">
                  <TypeFilter selectedType={selectedType} onTypeChange={setSelectedType} />
                </div>
              )}
            </div>

            {error && (
              <div className="container-px max-w-7xl mx-auto mb-6" role="alert">
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 p-4 text-center text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800">
                  ⚠️ {error}
                </div>
              </div>
            )}

            <main className="container-px max-w-7xl mx-auto">
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                {loading ? (
                  Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <SkeletonCard key={i} />)
                ) : !isNoResults ? (
                  paginatedPokemons.map((poke, i) => (
                    <div key={poke.id} className="animate-slide-up" style={{ animationDelay: `${(i % ITEMS_PER_PAGE) * 30}ms` }}>
                      <PokemonCard
                        id={poke.id}
                        name={poke.name}
                        type={poke.types[0]?.type.name || 'normal'}
                        image={poke.sprites.other.dream_world.front_default || poke.sprites.front_default}
                        isFavorite={isFavorite(poke.id)}
                        onToggleFavorite={() => toggleFavorite(poke.id)}
                        onClick={() => setSelectedPokemon(poke)}
                        isComparing={isComparing(poke.id)}
                        onToggleCompare={() => toggleCompare(poke)}
                        gradient={typeGradients[poke.types[0]?.type.name || 'normal']}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 sm:py-24 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl mb-4 sm:mb-6 ${
                      isFavoritesEmpty
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-400'
                        : 'bg-surface-secondary text-text-tertiary'
                    }`}>
                      <Heart size={32} className="sm:size-[36px]" />
                    </div>
                    <h3 className="text-text-primary font-semibold text-lg sm:text-xl mb-2">
                      {isFavoritesEmpty ? 'Nenhum favorito ainda' : 'Nenhum Pokémon encontrado'}
                    </h3>
                    <p className="text-text-secondary text-sm mb-4 sm:mb-6 max-w-xs">
                      {isFavoritesEmpty
                        ? 'Clique no coração nos cards para adicionar seus Pokémon favoritos.'
                        : 'Tente ajustar sua busca ou limpar os filtros.'}
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-text-primary text-surface rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
                    >
                      <Filter size={18} /> Limpar filtros
                    </button>
                  </div>
                )}
              </div>
            </main>

            {!loading && filteredPokemons.length > 0 && (
              <div className="container-px max-w-7xl mx-auto">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                <p className="text-center text-sm text-text-tertiary mt-3 sm:mt-4">
                  Página {currentPage} de {totalPages} &middot; {paginatedPokemons.length} Pokémon
                </p>
              </div>
            )}

            {selectedPokemon && (
              <PokemonModal
                pokemon={selectedPokemon}
                onClose={() => setSelectedPokemon(null)}
                onPokemonChange={setSelectedPokemon}
              />
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            <TypeCalculator />
          </div>
        )}

        {compareList.length > 0 && (
          <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 bg-surface rounded-full shadow-2xl border border-border p-1.5 sm:p-2 flex items-center gap-1 sm:gap-2 animate-slide-up max-w-[95vw] sm:max-w-none">
            <div className="flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-3">
              <Swords size={16} className="sm:size-[18px] text-brand-500 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-text-primary whitespace-nowrap">
                {compareList.length}/2
              </span>
            </div>
            <div className="w-px h-5 sm:h-6 bg-border mx-0.5 sm:mx-1" />
            <div className="flex items-center gap-1 sm:gap-2">
              {compareList.map(p => (
                <div key={p.id} className="relative group">
                  <img
                    src={p.sprites.other.dream_world.front_default || p.sprites.front_default}
                    alt={p.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                  />
                  <button
                    onClick={() => toggleCompare(p)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remover ${p.name} da comparação`}
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowCompare(true)}
              disabled={compareList.length < 2}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                compareList.length >= 2
                  ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/30'
                  : 'bg-surface-secondary text-text-tertiary cursor-not-allowed'
              }`}
            >
              Comparar
            </button>
            <button
              onClick={clearCompare}
              className="p-1.5 sm:p-2 hover:bg-surface-hover rounded-full text-text-tertiary hover:text-text-secondary transition-all"
              aria-label="Limpar comparação"
            >
              <X size={14} className="sm:size-[16px]" />
            </button>
          </div>
        )}

        {showCompare && (
          <CompareView list={compareList} onClose={() => setShowCompare(false)} />
        )}
      </div>
    </>
  );
}

export default App;
