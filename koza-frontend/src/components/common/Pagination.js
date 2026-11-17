import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../icons';

const squareBtn = 'w-12 h-12 flex items-center justify-center border transition-colors rounded-none';
const arrowBtn = `${squareBtn} border-gray-300 dark:border-gray-700 text-[#111] dark:text-white disabled:opacity-30 hover:bg-[#111] hover:text-white dark:hover:bg-white dark:hover:text-[#111]`;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const isFirst = currentPage === 1;
    const isLast = currentPage === totalPages;
    const prev = () => onPageChange(currentPage - 1);
    const next = () => onPageChange(currentPage + 1);

    return (
        <div className="mt-24 w-full flex flex-col items-center">
            {/* Mobile Pagination */}
            <div className="flex items-center justify-between w-full max-w-sm sm:hidden border border-gray-200 dark:border-gray-800 p-1 bg-white dark:bg-[#111]">
                <button onClick={prev} disabled={isFirst} className="p-3 text-[#111] dark:text-white disabled:opacity-30" aria-label="Previous page">
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#111] dark:text-white">Page {currentPage} of {totalPages}</span>
                <button onClick={next} disabled={isLast} className="p-3 text-[#111] dark:text-white disabled:opacity-30" aria-label="Next page">
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Desktop Pagination */}
            <div className="hidden sm:flex items-center justify-center gap-2 flex-wrap max-w-full">
                <button onClick={prev} disabled={isFirst} className={arrowBtn} aria-label="Previous page"><ChevronLeftIcon className="w-5 h-5" /></button>
                <div className="flex flex-wrap justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            aria-current={currentPage === page ? 'page' : undefined}
                            className={`${squareBtn} text-xs font-bold ${currentPage === page ? 'border-[#111] dark:border-white bg-[#111] dark:bg-white text-white dark:text-[#111]' : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:border-[#111] dark:hover:border-white'}`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <button onClick={next} disabled={isLast} className={arrowBtn} aria-label="Next page"><ChevronRightIcon className="w-5 h-5" /></button>
            </div>
        </div>
    );
};

export default Pagination;
