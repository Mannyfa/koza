// Small in-memory rate limiter (fixed window). Good for a single server instance,
// which is how the backend runs on Render. Counters reset when the server restarts.

const buckets = new Map(); // key -> { count, resetAt }

// Drop expired counters every 10 minutes so memory stays small
setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key);
    }
}, 10 * 60 * 1000).unref();

const normalise = (value) => String(value || '').trim().toLowerCase().slice(0, 200);

/**
 * @param {object} options
 * @param {string} options.name       label used in the counter key
 * @param {number} options.windowMs   window length in milliseconds
 * @param {number} options.max        requests allowed per window
 * @param {'ip'|'ip+email'|'email'} [options.by='ip']  what to count against
 * @param {string} [options.message]  error shown when the limit is hit
 */
const rateLimit = ({ name, windowMs, max, by = 'ip', message }) => (req, res, next) => {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const email = normalise(req.body && req.body.email);
    const subject = by === 'email' ? email : by === 'ip+email' ? `${ip}|${email}` : ip;
    if (by === 'email' && !email) return next();

    const key = `${name}:${subject}`;
    const now = Date.now();
    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
        bucket = { count: 0, resetAt: now + windowMs };
        buckets.set(key, bucket);
    }
    bucket.count += 1;

    if (bucket.count > max) {
        const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
        res.set('Retry-After', String(retryAfter));
        const minutes = Math.max(1, Math.ceil(retryAfter / 60));
        return res.status(429).json({
            status: 'fail',
            message: message || `Too many attempts. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`,
        });
    }
    next();
};

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

// Limits used across the API
const limits = {
    customerLogin: [
        rateLimit({ name: 'login-ip', windowMs: 15 * MINUTE, max: 30 }),
        rateLimit({ name: 'login', windowMs: 15 * MINUTE, max: 8, by: 'ip+email' }),
    ],
    adminLogin: [
        rateLimit({ name: 'admin-login-ip', windowMs: 15 * MINUTE, max: 15 }),
        rateLimit({ name: 'admin-login', windowMs: 15 * MINUTE, max: 5, by: 'ip+email' }),
    ],
    register: [rateLimit({ name: 'register', windowMs: HOUR, max: 10 })],
    forgotPassword: [
        rateLimit({ name: 'forgot-ip', windowMs: HOUR, max: 10 }),
        rateLimit({ name: 'forgot-email', windowMs: HOUR, max: 3, by: 'email' }),
    ],
    resetPassword: [rateLimit({ name: 'reset-ip', windowMs: 15 * MINUTE, max: 15 })],
    contact: [rateLimit({ name: 'contact', windowMs: HOUR, max: 5, message: 'You have sent several messages already. Please try again later or reach us on WhatsApp.' })],
    trackOrder: [rateLimit({ name: 'track', windowMs: 15 * MINUTE, max: 20 })],
};

module.exports = { rateLimit, limits, _buckets: buckets };
