// controllers/orderController.js
let placeholderOrders = [
    { 
        id: 101, 
        customer: { name: 'Amara K.', email: 'amara@example.com' }, 
        total: 150000, 
        status: 'Shipped', 
        date: new Date().toISOString(),
        items: [{ id: 1, name: 'Bone Straight HD Lace Wig', quantity: 1 }]
    },
    { 
        id: 102, 
        customer: { name: 'Funke A.', email: 'funke@example.com' }, 
        total: 125000, 
        status: 'Processing', 
        date: new Date().toISOString(),
        items: [{ id: 2, name: 'Deep Wave Frontal Wig', quantity: 1 }]
    },
];
let nextOrderId = 103;

// Exporting the array and nextId so they can be modified from the payment controller
module.exports.orders = placeholderOrders;
module.exports.getNextOrderId = () => nextOrderId++;

// Get all orders
module.exports.getAllOrders = (req, res) => {
    // Return orders in reverse chronological order
    const sortedOrders = [...placeholderOrders].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.status(200).json({ status: 'success', data: { orders: sortedOrders } });
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