// Keeps product stock counts in step with orders.

const LOW_STOCK_THRESHOLD = 3;

/**
 * Takes each ordered quantity off the product's stock (never below 0).
 * One database round trip per item in the normal case, two when stock runs short.
 * @returns {Promise<Array<{ name: string, stockAmount: number }>>} products now at or below the low-stock threshold
 */
const deductStock = async (Product, cart) => {
    const lowStock = [];
    const options = { returnDocument: 'after', projection: { name: 1, stockAmount: 1 } };
    for (const item of cart) {
        const id = item.product || item.id;
        if (!id) continue;
        let product = await Product.findOneAndUpdate(
            { _id: id, stockAmount: { $gte: item.quantity } },
            { $inc: { stockAmount: -item.quantity } },
            options
        );
        if (!product) {
            // Fewer left than were ordered (e.g. two buyers at once): clamp to 0
            product = await Product.findOneAndUpdate({ _id: id }, { $set: { stockAmount: 0 } }, options);
        }
        if (product && product.stockAmount <= LOW_STOCK_THRESHOLD) {
            lowStock.push({ name: product.name, stockAmount: product.stockAmount });
        }
    }
    return lowStock;
};

/** Puts each ordered quantity back (used when an order is cancelled). */
const restoreStock = async (Product, cart) => {
    const updates = cart
        .filter((item) => item.product || item.id)
        .map((item) => ({ updateOne: { filter: { _id: item.product || item.id }, update: { $inc: { stockAmount: item.quantity } } } }));
    if (updates.length) await Product.bulkWrite(updates); // one round trip for the whole order
};

module.exports = { LOW_STOCK_THRESHOLD, deductStock, restoreStock };
