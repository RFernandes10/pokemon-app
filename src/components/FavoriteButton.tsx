import { Heart } from 'lucide-react';

interface FavoriteButtonProps {
    isFavorite: boolean;
    onClick: () => void;
}

export function FavoriteButton({ isFavorite, onClick }: FavoriteButtonProps) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className={`
                absolute top-2.5 left-2.5 p-2 rounded-full transition-all duration-300 z-10
                ${isFavorite
                    ? 'bg-red-50 dark:bg-red-950/50 text-red-500 shadow-md hover:bg-red-100 dark:hover:bg-red-900/50'
                    : 'bg-surface/80 backdrop-blur-sm border border-border text-text-tertiary hover:text-red-400 hover:border-red-300 dark:hover:border-red-800'
                }
            `}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={isFavorite}
        >
            <Heart
                size={16}
                fill={isFavorite ? 'currentColor' : 'none'}
                className="transition-transform duration-300 active:scale-125"
            />
        </button>
    );
}
