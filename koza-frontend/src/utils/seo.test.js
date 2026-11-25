import { productSlug } from './formatters';
import { applyPageMeta } from './seo';

const storm = (id, size) => ({ _id: id, id, name: 'Storm ', bottleSize: size, price: 10000, description: 'Fresh aquatic scent', stockAmount: 3 });

test('products that share a name still get unique addresses', () => {
    const a = productSlug(storm('69f314d4fb0efd9e458427f1', '100ml'));
    const b = productSlug(storm('69f314d4fb0efd9e458427f2', '100ml'));
    expect(a).toBe('storm-100ml-8427f1');
    expect(b).toBe('storm-100ml-8427f2');
    expect(productSlug({ name: 'Oud Royale' })).toBe('oud-royale');
});

test('product pages get their own title, description, canonical and share tags', () => {
    applyPageMeta({ page: 'product', product: { ...storm('69f314d4fb0efd9e458427f1', '100ml'), category: 'Perfume', isOutOfStock: true } });
    expect(document.title).toBe('Storm (Perfume, 100ml) | Opevicky Scents');
    expect(document.querySelector('meta[name="description"]').content).toMatch(/currently out of stock/);
    expect(document.querySelector('link[rel="canonical"]').href).toMatch(/\/product\/storm-100ml-8427f1$/);
    expect(document.querySelector('meta[property="og:type"]').content).toBe('product');
    expect(document.querySelector('meta[name="robots"]').content).toBe('index, follow');
});

test('private pages are kept out of search results', () => {
    applyPageMeta({ page: 'checkout' });
    expect(document.querySelector('meta[name="robots"]').content).toBe('noindex, follow');
    applyPageMeta({ page: 'shop' });
    expect(document.title).toMatch(/^Shop All Fragrances/);
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
});
