// controllers/orderController.js
let placeholderOrders = [
    { 
        id: 101, 
        customer: { name: 'Amara K.', email: 'amara@example.com', phone: '08012345678' }, 
        shippingAddress: '123 Allen Avenue, Ikeja, Lagos',
        total: 150000, 
        status: 'Shipped', 
        date: new Date('2025-07-20').toISOString(),
        items: [{ id: 1, name: 'Bone Straight HD Lace Wig', quantity: 1, price: 150000 }],
        transactionRef: 'T123456789'
    },
    { 
        id: 102, 
        customer: { name: 'Funke A.', email: 'funke@example.com', phone: '09087654321' }, 
        shippingAddress: '456 Admiralty Way, Lekki Phase 1, Lagos',
        total: 125000, 
        status: 'Processing', 
        date: new Date('2025-07-22').toISOString(),
        items: [{ id: 2, name: 'Deep Wave Frontal Wig', quantity: 1, price: 125000 }],
        transactionRef: 'T987654321'
    },
];
let nextOrderId = 103;

module.exports.orders = placeholderOrders;
module.exports.getNextOrderId = () => nextOrderId++;

// Get all orders
module.exports.getAllOrders = (req, res) => {
    const sortedOrders = [...placeholderOrders].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.status(200).json({ status: 'success', data: { orders: sortedOrders } });
};

// --- NEW FUNCTION ---
// Get a single order by its ID
module.exports.getOrderById = (req, res) => {
    const order = placeholderOrders.find(o => o.id === parseInt(req.params.id));
    if (!order) {
        return res.status(404).json({ status: 'fail', message: 'Order not found' });
    }
    res.status(200).json({ status: 'success', data: { order } });
};


// Update order status
module.exports.updateOrderStatus = (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const orderIndex = placeholderOrders.findIndex(o => o.id === parseInt(id));

    if (orderIndex === -1) {
        return res.status(404).json({ status: 'fail', message: 'Order not found' });
    }

    placeholderOrders[orderIndex].status = status;
    res.status(200).json({ status: 'success', data: { order: placeholderOrders[orderIndex] } });
};
