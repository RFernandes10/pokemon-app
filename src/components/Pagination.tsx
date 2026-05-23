import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const getPages = () => {
        const pages: (number | 'ellipsis')[] = [];
        const delta = window.innerWidth < 640 ? 1 : 2;

        pages.push(1);
        if (currentPage - delta > 2) pages.push('ellipsis');

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            pages.push(i);
        }

        if (currentPage + delta < totalPages - 1) pages.push('ellipsis');
        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };

    const pages = getPages();

    return (
        <nav className="flex justify-center items-center gap-1 sm:gap-2 mt-6 sm:mt-8" aria-label="Paginação">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg bg-surface border border-border text-text-secondary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-sm"
            >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Anterior</span>
            </button>

            <div className="flex gap-1">
                {pages.map((page, i) =>
                    page === 'ellipsis' ? (
                        <span key={`ellipsis-${i}`} className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 text-text-tertiary text-sm select-none">
                            &hellip;
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            aria-current={currentPage === page ? 'page' : undefined}
                            className={`w-8 sm:w-10 h-8 sm:h-10 rounded-lg font-medium text-sm transition-all ${
                                currentPage === page
                                    ? 'bg-brand-500 text-white shadow-md scale-105'
                                    : 'bg-surface border border-border text-text-secondary hover:bg-surface-hover'
                            }`}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Próxima página"
                className="flex items-center gap-1 px-3 sm:px-4 py-2 rounded-lg bg-surface border border-border text-text-secondary hover:bg-surface-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium text-sm"
            >
                <span className="hidden sm:inline">Próximo</span>
                <ChevronRight size={16} />
            </button>
        </nav>
    );
}
