// controllers/settingsController.js
let placeholderSettings = { storeName: 'Koza Hair Plug', currency: 'NGN', contactEmail: 'support@kozahair.com' };
exports.getSettings = (req, res) => res.status(200).json({ status: 'success', data: { settings: placeholderSettings } });
exports.updateSettings = (req, res) => {
    placeholderSettings = { ...placeholderSettings, ...req.body };
    res.status(200).json({ status: 'success', data: { settings: placeholderSettings } });
};