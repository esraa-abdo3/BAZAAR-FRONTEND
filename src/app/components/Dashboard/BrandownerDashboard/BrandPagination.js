"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function BrandPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "items",
}) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-5 py-3 border-t border-gray-100">
      <p className="text-xs text-gray-400">
        Showing {start}–{end} of {totalItems} {itemLabel}
        <span className="hidden sm:inline">
          {" "}
          · Page {page} of {totalPages}
        </span>
      </p>
      <div className="flex items-center gap-1">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
              page === p
                ? "bg-indigo-600 text-white"
                : "border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
