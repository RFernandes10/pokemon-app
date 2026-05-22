import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
    isFavorite: boolean;
    onClick: () => void;
}

export function FavoriteButton({ isFavorite, onClick }: FavoriteButtonProps) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation(); // Impede que o clique abra o modal
                onClick();
            }}
            className={`
        absolute top-3 left-3 p-2 rounded-full transition-all duration-300 z-10
        ${isFavorite
                    ? 'bg-red-100 text-red-500 shadow-md hover:bg-red-200'
                    : 'bg-white/90 text-slate-300 hover:text-red-400 hover:bg-white'
                }
        backdrop-blur-sm border border-transparent hover:border-slate-200
      `}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={isFavorite}
        >
            <Heart
                size={18}
                fill={isFavorite ? 'currentColor' : 'none'}
                className="transition-transform duration-300 active:scale-125"
            />
        </button>
    );
}