import { getEffectivePrice, isOutOfStock } from './formatters';

export const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'discount', label: 'Biggest Discount' },
];

export const DEFAULT_FILTERS = { category: 'All', sort: 'featured', inStockOnly: false, onSaleOnly: false };

/** Categories that actually have products, in a stable order, with counts. */
export const getCategoryCounts = (products) => {
    const counts = new Map();
    for (const p of products) {
        if (p.category) counts.set(p.category, (counts.get(p.category) || 0) + 1);
    }
    return [...counts.entries()]
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([name, count]) => ({ name, count }));
};

/** Applies category / stock / sale filters, then sorting. Never mutates the input. */
export const applyFilters = (products, { category, sort, inStockOnly, onSaleOnly }) => {
    let list = products.filter((p) =>
        (category === 'All' || p.category === category) &&
        (!inStockOnly || !isOutOfStock(p)) &&
        (!onSaleOnly || p.discountPercentage > 0)
    );

    const byPrice = (a, b) => getEffectivePrice(a) - getEffectivePrice(b);
    switch (sort) {
        case 'price-asc': list = [...list].sort(byPrice); break;
        case 'price-desc': list = [...list].sort((a, b) => byPrice(b, a)); break;
        case 'name-asc': list = [...list].sort((a, b) => a.name.localeCompare(b.name)); break;
        case 'discount': list = [...list].sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0)); break;
        default:
            // Featured: keep catalogue order but push sold-out items to the end
            list = [...list].sort((a, b) => Number(isOutOfStock(a)) - Number(isOutOfStock(b)));
    }
    return list;
};
