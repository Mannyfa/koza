// Product search used by the header suggestions and the search page.

const normalise = (text) =>
    String(text || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '') // strip accents
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

/**
 * Returns products matching every word of `query`, best matches first.
 * Searches name, category, bottle size and description; name matches rank highest.
 */
export const searchProducts = (products, query, limit = Infinity) => {
    const words = normalise(query).split(' ').filter(Boolean);
    if (words.length === 0) return [];

    const scored = [];
    for (const product of products) {
        const name = normalise(product.name);
        const category = normalise(product.category);
        const size = normalise(product.bottleSize);
        const description = normalise(product.description);

        let score = 0;
        let matchesAll = true;
        for (const word of words) {
            if (name.startsWith(word)) score += 10;
            else if (name.split(' ').some((part) => part.startsWith(word))) score += 6;
            else if (name.includes(word)) score += 4;
            else if (category.includes(word)) score += 3;
            else if (size.includes(word)) score += 2;
            else if (description.includes(word)) score += 1;
            else { matchesAll = false; break; }
        }
        if (matchesAll) scored.push({ product, score });
    }

    return scored
        .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name))
        .slice(0, limit)
        .map((entry) => entry.product);
};
