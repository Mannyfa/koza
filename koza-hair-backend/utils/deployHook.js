// Triggers a Vercel rebuild of the storefront so its pre-rendered product pages
// and sitemap pick up product changes. Set VERCEL_DEPLOY_HOOK_URL on Render
// (Vercel → Project → Settings → Git → Deploy Hooks). Without it this does nothing.

const https = require('https');

const DEBOUNCE_MS = 2 * 60 * 1000; // wait for the admin to finish a batch of edits
let timer = null;

const callHook = (url) => {
    const req = https.request(url, { method: 'POST', timeout: 15000 }, (res) => {
        res.resume();
        console.log(`🔁 Storefront rebuild requested (Vercel responded ${res.statusCode})`);
    });
    req.on('error', (e) => console.error('❌ Could not trigger storefront rebuild:', e.message));
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.end();
};

/** Schedules one rebuild a couple of minutes after the most recent product change. */
const scheduleStorefrontRebuild = () => {
    const url = process.env.VERCEL_DEPLOY_HOOK_URL;
    if (!url || !url.startsWith('https://')) return;
    clearTimeout(timer);
    timer = setTimeout(() => callHook(url), DEBOUNCE_MS);
    timer.unref();
};

module.exports = { scheduleStorefrontRebuild };
