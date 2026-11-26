import React, { useEffect, useRef, useState } from 'react';
import { DEFAULT_FILTERS, SORT_OPTIONS } from '../../utils/filters';
import { ChevronDownIcon } from '../icons';

const controlBox = 'h-11 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] text-[10px] font-bold uppercase tracking-[0.15em] text-[#111] dark:text-white rounded-none';

/** "Filter by category" button that opens a list of categories with product counts. */
const CategoryDropdown = ({ value, categories, totalCount, onChange }) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const buttonRef = useRef(null);
    const optionRefs = useRef([]);
    const options = [{ name: 'All', count: totalCount }, ...categories];
    const selectedIndex = Math.max(0, options.findIndex((o) => o.name === value));

    // Close on outside click
    useEffect(() => {
        if (!open) return undefined;
        const onClick = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [open]);

    // Focus the selected option when the list opens
    useEffect(() => {
        if (open) optionRefs.current[selectedIndex]?.focus();
    }, [open, selectedIndex]);

    const choose = (name) => {
        onChange(name);
        setOpen(false);
        buttonRef.current?.focus();
    };

    const onListKeyDown = (e) => {
        const index = optionRefs.current.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); optionRefs.current[Math.min(index + 1, options.length - 1)]?.focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); optionRefs.current[Math.max(index - 1, 0)]?.focus(); }
        else if (e.key === 'Home') { e.preventDefault(); optionRefs.current[0]?.focus(); }
        else if (e.key === 'End') { e.preventDefault(); optionRefs.current[options.length - 1]?.focus(); }
        else if (e.key === 'Escape' || e.key === 'Tab') { setOpen(false); if (e.key === 'Escape') buttonRef.current?.focus(); }
    };

    const label = value === 'All' ? 'Filter by category' : value;

    return (
        <div ref={wrapperRef} className="relative w-full sm:w-auto">
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={value === 'All' ? 'Filter by category' : `Category: ${value}. Change category`}
                className={`${controlBox} w-full sm:w-auto sm:min-w-[220px] flex items-center justify-between gap-3 px-4 hover:border-[#111] dark:hover:border-white transition-colors ${value !== 'All' ? '!border-[#111] dark:!border-white' : ''}`}
            >
                <span className="truncate">{label}</span>
                <ChevronDownIcon className={`w-4 h-4 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <ul
                    role="listbox"
                    aria-label="Categories"
                    onKeyDown={onListKeyDown}
                    className="absolute z-30 left-0 right-0 sm:right-auto sm:w-80 mt-2 max-h-80 overflow-y-auto bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 shadow-xl py-2"
                >
                    {options.map((option, i) => {
                        const selected = option.name === value;
                        return (
                            <li key={option.name} role="none">
                                <button
                                    ref={(el) => { optionRefs.current[i] = el; }}
                                    type="button"
                                    role="option"
                                    aria-selected={selected}
                                    onClick={() => choose(option.name)}
                                    className={`w-full flex items-center justify-between gap-4 px-4 py-3 text-left text-[11px] font-bold uppercase tracking-[0.15em] transition-colors focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900 ${selected ? 'text-[#111] dark:text-white' : 'text-gray-500'}`}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className={`w-1.5 h-1.5 rounded-full ${selected ? 'bg-[#111] dark:bg-white' : 'bg-transparent'}`} aria-hidden="true" />
                                        {option.name === 'All' ? 'All categories' : option.name}
                                    </span>
                                    <span className="text-gray-400 font-medium">{option.count}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

const Toggle = ({ checked, onChange, label }) => (
    <label className="flex items-center gap-2 cursor-pointer select-none text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="rounded-none border-gray-400 text-[#111] focus:ring-[#111]" />
        {label}
    </label>
);

/** Category dropdown, sort menu and quick toggles shown above the shop grid. */
const ShopFilters = ({ filters, onChange, categories, totalCount, resultCount }) => {
    const set = (patch) => onChange({ ...filters, ...patch });
    const isFiltered = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

    return (
        <div className="mb-12 border-y border-gray-200 dark:border-gray-800 py-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                {categories.length > 0 ? (
                    <CategoryDropdown
                        value={filters.category}
                        categories={categories}
                        totalCount={totalCount}
                        onChange={(category) => set({ category })}
                    />
                ) : <span />}

                <div className="relative w-full sm:w-auto">
                    <label className="sr-only" htmlFor="shop-sort">Sort by</label>
                    <select
                        id="shop-sort"
                        value={filters.sort}
                        onChange={(e) => set({ sort: e.target.value })}
                        className={`${controlBox} w-full sm:w-auto sm:min-w-[220px] pl-4 pr-10 focus:ring-0 focus:border-[#111] dark:focus:border-white`}
                    >
                        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value} className="text-[#111]">Sort: {o.label}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
                <div className="flex flex-wrap items-center gap-6">
                    <Toggle checked={filters.inStockOnly} onChange={(v) => set({ inStockOnly: v })} label="In stock only" />
                    <Toggle checked={filters.onSaleOnly} onChange={(v) => set({ onSaleOnly: v })} label="On sale" />
                </div>
                <div className="flex items-center gap-6">
                    {isFiltered && (
                        <button onClick={() => onChange(DEFAULT_FILTERS)} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] dark:text-white border-b border-[#111] dark:border-white">
                            Clear filters
                        </button>
                    )}
                    <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400" aria-live="polite">{resultCount} item{resultCount === 1 ? '' : 's'}</span>
                </div>
            </div>
        </div>
    );
};

export default ShopFilters;
