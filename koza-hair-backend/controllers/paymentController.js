// controllers/paymentController.js
const axios = require('axios');
// Import the orders array and the function to get the next ID
const { orders, getNextOrderId } = require('./orderController');

exports.verifyPayment = async (req, res) => {
    const { reference } = req.body;

    if (!reference) {
        return res.status(400).json({ status: 'fail', message: 'Transaction reference is required.' });
    }

    try {
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
        });

        const { status, data } = response.data;

        if (status === true && data.status === 'success') {
            // --- CREATE THE ORDER ---
            const newOrder = {
                id: getNextOrderId(),
                customer: {
                    name: data.metadata.name,
                    email: data.customer.email,
                    phone: data.metadata.phone,
                },
                total: data.amount / 100, // Convert from kobo to Naira
                status: 'Processing',
                date: new Date().toISOString(),
                items: data.metadata.cartItems || [],
                transactionRef: reference,
            };

            orders.push(newOrder);
            console.log('New order created:', newOrder);

            res.status(200).json({
                status: 'success',
                message: 'Payment verified and order created.',
            });
        } else {
            res.status(400).json({ status: 'fail', message: 'Payment verification failed.', data });
        }
    } catch (error) {
        console.error('Paystack verification error:', error.response ? error.response.data : error.message);
        res.status(500).json({ status: 'error', message: 'An error occurred during payment verification.' });
    }
};
