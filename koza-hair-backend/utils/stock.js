// Keeps product stock counts in step with orders.

const LOW_STOCK_THRESHOLD = 3;

/**
 * Takes each ordered quantity off the product's stock (never below 0).
 * @returns {Promise<Array<{ name: string, stockAmount: number }>>} products now at or below the low-stock threshold
 */
const deductStock = async (Product, cart) => {
    const lowStock = [];
    for (const item of cart) {
        const id = item.product || item.id;
        if (!id) continue;
        const result = await Product.updateOne(
            { _id: id, stockAmount: { $gte: item.quantity } },
            { $inc: { stockAmount: -item.quantity } }
        );
        if (result.modifiedCount === 0) {
            // Fewer left than were ordered (e.g. two buyers at once): clamp to 0
            await Product.updateOne({ _id: id }, { $set: { stockAmount: 0 } });
        }
        const product = await Product.findById(id).select('name stockAmount');
        if (product && product.stockAmount <= LOW_STOCK_THRESHOLD) {
            lowStock.push({ name: product.name, stockAmount: product.stockAmount });
        }
    }
    return lowStock;
};

/** Puts each ordered quantity back (used when an order is cancelled). */
const restoreStock = async (Product, cart) => {
    for (const item of cart) {
        const id = item.product || item.id;
        if (!id) continue;
        await Product.updateOne({ _id: id }, { $inc: { stockAmount: item.quantity } });
    }
};

module.exports = { LOW_STOCK_THRESHOLD, deductStock, restoreStock };
