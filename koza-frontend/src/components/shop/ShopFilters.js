import React from 'react';
import { DEFAULT_FILTERS, SORT_OPTIONS } from '../../utils/filters';

const chip = (active) =>
    `px-4 py-2 border text-[10px] font-bold uppercase tracking-[0.2em] transition-colors rounded-none whitespace-nowrap ${
        active
            ? 'border-[#111] dark:border-white bg-[#111] dark:bg-white text-white dark:text-[#111]'
            : 'border-gray-300 dark:border-gray-700 text-gray-500 hover:border-[#111] dark:hover:border-white hover:text-[#111] dark:hover:text-white'
    }`;

const Toggle = ({ checked, onChange, label }) => (
    <label className="flex items-center gap-2 cursor-pointer select-none text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="rounded-none border-gray-400 text-[#111] focus:ring-[#111]" />
        {label}
    </label>
);

/** Category chips, sort menu and quick toggles shown above the shop grid. */
const ShopFilters = ({ filters, onChange, categories, totalCount, resultCount }) => {
    const set = (patch) => onChange({ ...filters, ...patch });
    const isFiltered = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

    return (
        <div className="mb-12 space-y-6">
            {categories.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-wrap" role="group" aria-label="Filter by category">
                    <button onClick={() => set({ category: 'All' })} className={chip(filters.category === 'All')} aria-pressed={filters.category === 'All'}>
                        All <span className="opacity-60">({totalCount})</span>
                    </button>
                    {categories.map(({ name, count }) => (
                        <button key={name} onClick={() => set({ category: name })} className={chip(filters.category === name)} aria-pressed={filters.category === name}>
                            {name} <span className="opacity-60">({count})</span>
                        </button>
                    ))}
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-gray-200 dark:border-gray-800 py-4">
                <div className="flex flex-wrap items-center gap-6">
                    <Toggle checked={filters.inStockOnly} onChange={(v) => set({ inStockOnly: v })} label="In stock only" />
                    <Toggle checked={filters.onSaleOnly} onChange={(v) => set({ onSaleOnly: v })} label="On sale" />
                    {isFiltered && (
                        <button onClick={() => onChange(DEFAULT_FILTERS)} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] dark:text-white border-b border-[#111] dark:border-white">
                            Clear filters
                        </button>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400" aria-live="polite">{resultCount} item{resultCount === 1 ? '' : 's'}</span>
                    <label className="sr-only" htmlFor="shop-sort">Sort by</label>
                    <select
                        id="shop-sort"
                        value={filters.sort}
                        onChange={(e) => set({ sort: e.target.value })}
                        className="bg-transparent border border-gray-300 dark:border-gray-700 text-[10px] font-bold uppercase tracking-[0.15em] text-[#111] dark:text-white py-2 pl-3 pr-8 rounded-none focus:ring-0 focus:border-[#111] dark:focus:border-white"
                    >
                        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value} className="text-[#111]">{o.label}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ShopFilters;
