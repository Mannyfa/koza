// controllers/orderController.js
const placeholderOrders = [
    { id: 101, customerName: 'Amara K.', total: 150000, status: 'Shipped', date: '2024-07-15' },
    { id: 102, customerName: 'Funke A.', total: 125000, status: 'Processing', date: '2024-07-17' },
];
exports.getAllOrders = (req, res) => res.status(200).json({ status: 'success', data: { orders: placeholderOrders } });
