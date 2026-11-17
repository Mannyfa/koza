import React from 'react';

// --- Minimalist Skeleton Loader ---
const ProductSkeleton = () => (
    <div className="flex flex-col animate-pulse">
        <div className="w-full aspect-[3/4] bg-gray-200 dark:bg-gray-800 mb-4 rounded-none"></div>
        <div className="h-2.5 bg-gray-200 dark:bg-gray-800 w-1/4 mb-3"></div>
        <div className="flex justify-between items-start gap-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 w-16"></div>
        </div>
    </div>
);

export default ProductSkeleton;
