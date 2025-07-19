// controllers/paymentController.js
const axios = require('axios');

exports.verifyPayment = async (req, res) => {
    const { reference } = req.body;

    if (!reference) {
        return res.status(400).json({ status: 'fail', message: 'Transaction reference is required.' });
    }

    try {
        // Make a secure, server-to-server request to Paystack's verification endpoint
        const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: {
                // Use the secret key from your environment variables
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        });

        const { status, data } = response.data;

        // Check if the transaction was successful
        if (status === true && data.status === 'success') {
            // Payment is verified successfully.
            // At this point, you would typically:
            // 1. Check if `data.amount` matches the order total in your database.
            // 2. Check if you haven't already fulfilled an order for this reference.
            // 3. Create the order in your database.
            // 4. Send a success response to the frontend.

            console.log('Payment verified successfully:', data);

            res.status(200).json({
                status: 'success',
                message: 'Payment verified successfully.',
                data: data,
            });
        } else {
            // If Paystack says the transaction was not successful
            res.status(400).json({ status: 'fail', message: 'Payment verification failed.', data });
        }
    } catch (error) {
        console.error('Paystack verification error:', error.response ? error.response.data : error.message);
        res.status(500).json({ status: 'error', message: 'An error occurred during payment verification.' });
    }
};
