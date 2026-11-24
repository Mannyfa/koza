import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatPrice, getEffectivePrice, getImageUrl } from '../../utils/formatters';
import { searchProducts } from '../../utils/search';
import { SearchIcon } from '../icons';

const MAX_SUGGESTIONS = 5;

/**
 * Search input with live product suggestions.
 * Enter (or "See all results") runs a full search; picking a suggestion opens that product.
 */
const SearchBox = ({ products = [], onSearch, onProductClick, autoFocus = false, className = '', inputClassName = '', onDone }) => {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const wrapperRef = useRef(null);

    const suggestions = useMemo(
        () => (query.trim().length >= 2 ? searchProducts(products, query, MAX_SUGGESTIONS) : []),
        [products, query]
    );

    // Close the dropdown when clicking elsewhere
    useEffect(() => {
        const handleClick = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const finish = () => {
        setOpen(false);
        setActive(-1);
        setQuery('');
        if (onDone) onDone();
    };

    const runSearch = () => {
        const q = query.trim();
        if (!q) return;
        onSearch(q);
        finish();
    };

    const pick = (product) => {
        onProductClick(product);
        finish();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown' && suggestions.length) {
            e.preventDefault();
            setOpen(true);
            setActive((i) => (i + 1) % suggestions.length);
        } else if (e.key === 'ArrowUp' && suggestions.length) {
            e.preventDefault();
            setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
        } else if (e.key === 'Escape') {
            setOpen(false);
            setActive(-1);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (open && active >= 0 && suggestions[active]) pick(suggestions[active]);
        else runSearch();
    };

    const showDropdown = open && query.trim().length >= 2;

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <form onSubmit={handleSubmit} role="search" className="flex items-center w-full">
                <SearchIcon />
                <input
                    type="search"
                    value={query}
                    autoFocus={autoFocus}
                    onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(-1); }}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="SEARCH..."
                    aria-label="Search products"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={showDropdown}
                    aria-controls="search-suggestions"
                    className={`bg-transparent border-none outline-none focus:ring-0 text-xs font-medium tracking-[0.15em] uppercase text-[#111] placeholder-gray-500 ml-2 ${inputClassName}`}
                />
            </form>

            {showDropdown && (
                <div id="search-suggestions" role="listbox" className="absolute left-0 right-0 sm:right-auto sm:w-80 mt-3 bg-white border border-gray-200 shadow-xl z-50">
                    {suggestions.length === 0 ? (
                        <p className="px-4 py-4 text-[10px] uppercase tracking-widest text-gray-500">No matches for "{query.trim()}"</p>
                    ) : (
                        <ul>
                            {suggestions.map((product, i) => (
                                <li key={product.id} role="option" aria-selected={i === active}>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => pick(product)}
                                        onMouseEnter={() => setActive(i)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${i === active ? 'bg-gray-50' : ''}`}
                                    >
                                        <img src={getImageUrl(product.image)} alt="" className="w-10 h-12 object-cover bg-gray-100 flex-shrink-0" />
                                        <span className="flex-1 min-w-0">
                                            <span className="block text-xs font-medium text-[#111] truncate">{product.name}</span>
                                            <span className="block text-[10px] text-gray-500 uppercase tracking-widest truncate">
                                                {[product.category, product.bottleSize].filter(Boolean).join(' · ') || 'Fragrance'}
                                            </span>
                                        </span>
                                        <span className="text-xs text-[#111] flex-shrink-0">{formatPrice(getEffectivePrice(product))}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={runSearch} className="w-full text-left px-4 py-3 border-t border-gray-100 text-[10px] font-bold uppercase tracking-[0.2em] text-[#111] hover:bg-gray-50">
                        See all results for "{query.trim()}" →
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchBox;
