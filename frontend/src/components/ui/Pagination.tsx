export type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

const Pagination = (props: PaginationProps) => {
  const { page, totalPages, onPageChange, className } = props;

  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  // Show up to 5 page numbers, with ellipsis if needed
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);
    if (page <= 3) {
      end = Math.min(5, totalPages);
    } else if (page >= totalPages - 2) {
      start = Math.max(1, totalPages - 4);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };
  const pageNumbers = getPageNumbers();

  return (
    <nav
      className={`flex items-center justify-center gap-2 mt-8 ${className || ''}`}
      aria-label="Pagination"
    >
      <button
        className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        onClick={handlePrev}
        disabled={page === 1}
        aria-label="Previous page"
      >
        &lt;
      </button>
      {pageNumbers.map((num) => (
        <button
          key={num}
          className={`px-3 py-1 rounded ${num === page ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => onPageChange(num)}
          aria-current={num === page ? 'page' : undefined}
        >
          {num}
        </button>
      ))}
      {pageNumbers.length > 0 && pageNumbers[pageNumbers.length - 1] < totalPages && (
        <span className="px-2">...</span>
      )}
      <button
        className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
        onClick={handleNext}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        &gt;
      </button>
    </nav>
  );
};

export default Pagination;
