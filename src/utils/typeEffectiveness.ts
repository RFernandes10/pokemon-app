// src/utils/typeEffectiveness.ts

// Tabela simplificada focada nos 151 primeiros (Gen 1), mas extensível
const TYPE_CHART: Record<string, Record<string, number>> = {
  normal: { fighting: 2, ghost: 0 },
  fire: {
    water: 2,
    ground: 2,
    rock: 2,
    fire: 0.5,
    grass: 0.5,
    ice: 0.5,
    bug: 0.5,
    steel: 0.5,
    fairy: 0.5,
  },
  water: { grass: 2, electric: 2, fire: 0.5, water: 0.5, ice: 0.5, steel: 0.5 },
  electric: { ground: 2, electric: 0.5, flying: 0.5, steel: 0.5 },
  grass: {
    fire: 2,
    ice: 2,
    poison: 2,
    flying: 2,
    bug: 2,
    water: 0.5,
    electric: 0.5,
    grass: 0.5,
    ground: 0.5,
  },
  ice: { fire: 2, fighting: 2, rock: 2, steel: 2, ice: 0.5 },
  fighting: { flying: 2, psychic: 2, fairy: 2, rock: 0.5, bug: 0.5, dark: 0.5 },
  poison: {
    ground: 2,
    psychic: 2,
    fighting: 0.5,
    poison: 0.5,
    bug: 0.5,
    grass: 0.5,
    fairy: 0.5,
  },
  ground: { water: 2, grass: 2, ice: 2, poison: 0.5, rock: 0.5, electric: 0 },
  flying: {
    electric: 2,
    ice: 2,
    rock: 2,
    fighting: 0.5,
    bug: 0.5,
    grass: 0.5,
    ground: 0,
  },
  psychic: { bug: 2, ghost: 2, dark: 2, fighting: 0.5, psychic: 0.5 },
  bug: { fire: 2, flying: 2, rock: 2, fighting: 0.5, ground: 0.5, grass: 0.5 },
  rock: {
    water: 2,
    grass: 2,
    fighting: 2,
    ground: 2,
    steel: 2,
    normal: 0.5,
    fire: 0.5,
    poison: 0.5,
    flying: 0.5,
  },
  ghost: { ghost: 2, dark: 2, normal: 0, fighting: 0, poison: 0.5, bug: 0.5 },
  dragon: {
    ice: 2,
    dragon: 2,
    fairy: 2,
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    grass: 0.5,
  },
  dark: { fighting: 2, bug: 2, fairy: 2, ghost: 0.5, psychic: 0, dark: 0.5 },
  steel: {
    fire: 2,
    fighting: 2,
    ground: 2,
    normal: 0.5,
    grass: 0.5,
    ice: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 0.5,
    dragon: 0.5,
    steel: 0.5,
    fairy: 0.5,
    poison: 0,
  },
  fairy: { poison: 2, steel: 2, fighting: 0.5, bug: 0.5, dark: 0.5, dragon: 0 },
};

export interface TypeMatchup {
  type: string;
  multiplier: number;
}

export function calculateTypeEffectiveness(pokemonTypes: string[]): {
  weaknesses: TypeMatchup[];
  resistances: TypeMatchup[];
  immunities: TypeMatchup[];
} {
  const allTypes = Object.keys(TYPE_CHART);
  const multipliers: Record<string, number> = {};

  // Inicializa todos como 1x
  allTypes.forEach((t) => (multipliers[t] = 1));

  // Aplica cada tipo do Pokémon
  pokemonTypes.forEach((defenderType) => {
    const chart = TYPE_CHART[defenderType];
    if (!chart) return;

    Object.entries(chart).forEach(([attackerType, multiplier]) => {
      multipliers[attackerType] *= multiplier;
    });
  });

  const weaknesses: TypeMatchup[] = [];
  const resistances: TypeMatchup[] = [];
  const immunities: TypeMatchup[] = [];

  Object.entries(multipliers).forEach(([type, mult]) => {
    if (mult === 0) immunities.push({ type, multiplier: 0 });
    else if (mult >= 2) weaknesses.push({ type, multiplier: mult });
    else if (mult < 1) resistances.push({ type, multiplier: mult });
  });

  // Ordena do mais forte para o mais fraco
  weaknesses.sort((a, b) => b.multiplier - a.multiplier);
  resistances.sort((a, b) => a.multiplier - b.multiplier);
  immunities.sort((a, b) => a.type.localeCompare(b.type));

  return { weaknesses, resistances, immunities };
}

export const ALL_TYPES = Object.keys(TYPE_CHART);
