import { useState } from 'react';
import type { PokemonDetail } from '../types/pokemon';

export function useComparison() {
  const [compareList, setCompareList] = useState<PokemonDetail[]>([]);

  const toggleCompare = (pokemon: PokemonDetail) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === pokemon.id);
      if (exists) {
        return prev.filter(p => p.id !== pokemon.id); // Remove se já existe
      }
      if (prev.length >= 2) {
        return [prev[1], pokemon]; // Substitui o mais antigo se já tiver 2 (FIFO)
      }
      return [...prev, pokemon]; // Adiciona
    });
  };

  const clearCompare = () => setCompareList([]);
  const isComparing = (id: number) => !!compareList.find(p => p.id === id);

  return { compareList, toggleCompare, clearCompare, isComparing };
}