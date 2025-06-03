'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type Props = {
  currentPage: number;
  totalResults: number;
  onPageChange: (page: number) => void;
};

function createPageArray(start: number, end: number) {
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}

export default function PaginationControls({
  currentPage,
  totalResults,
  onPageChange,
}: Props) {
  const pageSize = 9;
  const totalPages = Math.min(10, Math.ceil(totalResults / pageSize));

  if (totalPages <= 1) return null;

  const siblingCount = 1;
  const startPage = Math.max(currentPage - siblingCount, 2);
  const endPage = Math.min(currentPage + siblingCount, totalPages - 1);
  const siblings = createPageArray(startPage, endPage);

  return (
    <div className="mt-16 flex justify-center">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink
              isActive={currentPage === 1}
              className={`cursor-default ${
                currentPage === 1 ? 'border-2 border-black font-semibold' : 'text-gray-400'
              }`}
            >
              1
            </PaginationLink>
          </PaginationItem>

          {startPage > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {siblings.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                isActive={page === currentPage}
                className={`cursor-default ${
                  page === currentPage ? 'border-2 border-black font-semibold' : 'text-gray-400'
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {endPage < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {totalPages > 1 && (
            <PaginationItem>
              <PaginationLink
                isActive={currentPage === totalPages}
                className={`cursor-default ${
                  currentPage === totalPages ? 'border-2 border-black font-semibold' : 'text-gray-400'
                }`}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
