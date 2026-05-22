// src/hooks/usePokemonList.ts
import { useState, useEffect } from 'react';
import type { PokemonDetail } from '../types/pokemon';

export function usePokemonList() {
  const [data, setData] = useState<PokemonDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        // Busca a lista básica
        const listResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        if (!listResponse.ok) throw new Error('Falha na conexão com a PokéAPI');
        
        const listData = await listResponse.json();

        // Busca detalhes de cada um (Promise.all para performance)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const detailsPromises = listData.results.map(async (p: any) => {
          const res = await fetch(p.url);
          return res.json();
        });

        const results = await Promise.all(detailsPromises);
        setData(results);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { data, loading, error };
}