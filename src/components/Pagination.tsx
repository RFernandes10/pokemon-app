interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="flex justify-center items-center gap-2 mt-8" aria-label="Paginação">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Página anterior"
                className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
                ← Anterior
            </button>

            <div className="flex gap-1 overflow-x-auto max-w-50 sm:max-w-none scrollbar-hide">
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        aria-current={currentPage === page ? 'page' : undefined}
                        className={`min-w-10 h-10 rounded-lg font-medium transition-all ${currentPage === page
                                ? 'bg-blue-500 text-white shadow-md scale-105'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Próxima página"
                className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
                Próximo →
            </button>
        </nav>
    );
}