// src/types/pokemon.ts

export interface PokemonBase {
  name: string;
  url: string;
}

export interface Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number; // em decímetros
  weight: number; // em hectogramas
  types: { type: { name: string } }[];
  stats: Stat[];
  sprites: {
    other: {
      dream_world: { front_default: string };
    };
    front_default: string;
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  stats: Stat[];
  sprites: {
    other: {
      dream_world: { front_default: string };
    };
    front_default: string;
  };
  cries: {
    latest: string; // Adicione esta linha
  };
}