// controllers/customerController.js
const placeholderCustomers = [
    { id: 1, name: 'Amara K.', email: 'amara@example.com', totalSpent: 150000 },
    { id: 2, name: 'Funke A.', email: 'funke@example.com', totalSpent: 125000 },
];
exports.getAllCustomers = (req, res) => res.status(200).json({ status: 'success', data: { customers: placeholderCustomers } });
