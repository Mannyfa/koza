// controllers/dashboardController.js
const { orders } = require('./orderController');
const { products } = require('./productController'); // Assuming products are exported from productController

exports.getDashboardStats = (req, res) => {
    // --- Calculate Total Revenue and Sales ---
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalSales = orders.length;

    // --- Calculate Best-Selling Products ---
    const productSales = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
        });
    });

    const bestSellers = Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5) // Get top 5
        .map(([id, count]) => {
            const product = products.find(p => p.id === parseInt(id));
            return {
                name: product ? product.name : `Product ID ${id}`,
                count: count
            };
        });

    // --- Generate Dummy Sales Data for Chart (Last 7 Days) ---
    const salesData = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        salesData.push({
            name: date.toLocaleDateString('en-US', { weekday: 'short' }),
            // Generate random sales for demonstration
            sales: Math.floor(Math.random() * (200000 - 50000 + 1) + 50000)
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            totalRevenue,
            totalSales,
            bestSellers,
            salesData
        }
    });
};
