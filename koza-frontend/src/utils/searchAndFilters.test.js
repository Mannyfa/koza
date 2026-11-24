import { searchProducts } from './search';
import { applyFilters, DEFAULT_FILTERS, getCategoryCounts } from './filters';

const products = [
    { id: '1', name: 'Khamrah Dukhan by Lattafa', category: 'Perfume', bottleSize: '100ml', price: 42000, description: 'Smoky oud and spice', stockAmount: 4 },
    { id: '2', name: 'Liora Reed Diffuser', category: 'Diffuser', bottleSize: '100ml', price: 12000, description: 'Calming home scent', stockAmount: 50, discountPercentage: 10 },
    { id: '3', name: 'Scented Candle', category: 'Scented Candle', bottleSize: '200g', price: 25000, description: 'Vanilla and oud notes', stockAmount: 0 },
    { id: '4', name: 'Oud Royale', category: 'Perfume', bottleSize: '50ml', price: 30000, description: '', stockAmount: 3, isOutOfStock: true },
];

describe('searchProducts', () => {
    test('ranks name matches above description matches', () => {
        expect(searchProducts(products, 'oud').map((p) => p.id)).toEqual(['4', '1', '3']);
    });
    test('every word must match, across fields', () => {
        expect(searchProducts(products, 'perfume 100ml').map((p) => p.id)).toEqual(['1']);
        expect(searchProducts(products, 'diffuser vanilla')).toEqual([]);
    });
    test('is case- and punctuation-insensitive and respects the limit', () => {
        expect(searchProducts(products, '  LIORA!! ').map((p) => p.id)).toEqual(['2']);
        expect(searchProducts(products, 'ml', 1)).toHaveLength(1);
        expect(searchProducts(products, '   ')).toEqual([]);
    });
});

describe('shop filters', () => {
    test('category counts only list categories in use', () => {
        expect(getCategoryCounts(products)).toEqual([
            { name: 'Diffuser', count: 1 }, { name: 'Perfume', count: 2 }, { name: 'Scented Candle', count: 1 },
        ]);
    });
    test('category, in-stock and on-sale filters', () => {
        expect(applyFilters(products, { ...DEFAULT_FILTERS, category: 'Perfume' }).map((p) => p.id)).toEqual(['1', '4']);
        expect(applyFilters(products, { ...DEFAULT_FILTERS, inStockOnly: true }).map((p) => p.id)).toEqual(['1', '2']);
        expect(applyFilters(products, { ...DEFAULT_FILTERS, onSaleOnly: true }).map((p) => p.id)).toEqual(['2']);
    });
    test('sorting uses the discounted price and featured puts sold-out last', () => {
        expect(applyFilters(products, { ...DEFAULT_FILTERS, sort: 'price-asc' }).map((p) => p.id)).toEqual(['2', '3', '4', '1']);
        expect(applyFilters(products, { ...DEFAULT_FILTERS, sort: 'price-desc' }).map((p) => p.id)).toEqual(['1', '4', '3', '2']);
        expect(applyFilters(products, DEFAULT_FILTERS).map((p) => p.id)).toEqual(['1', '2', '3', '4']);
        expect(products.map((p) => p.id)).toEqual(['1', '2', '3', '4']); // input not mutated
    });
});
