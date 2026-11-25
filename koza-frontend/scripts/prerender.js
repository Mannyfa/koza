#!/usr/bin/env node
/*
 * Build-time pre-rendering for search engines and link previews.
 *
 * Runs after `react-scripts build`. For every public page and every active
 * product it writes build/<path>/index.html containing:
 *   - a unique <title>, meta description, canonical link and share tags
 *   - structured data (Organization, WebSite search, Product, Breadcrumbs)
 *   - real, readable text and links inside #root, so crawlers that do not run
 *     JavaScript still see the content. React replaces it on load.
 * It also writes sitemap.xml, robots.txt, products-snapshot.json (loaded by the
 * site instantly while the API wakes up) and app-shell.html (the SPA fallback).
 *
 * Settings (Vercel → Project → Settings → Environment Variables):
 *   SITE_URL                public address, e.g. https://www.example.com.ng
 *                           (falls back to Vercel's production domain)
 *   REACT_APP_API_BASE_URL  backend address (defaults to the Render backend)
 *
 * The build never fails because of this script: if the API is unreachable the
 * static pages are still written, just without the product list.
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'build');
const API_BASE = (process.env.REACT_APP_API_BASE_URL || 'https://koza-2fkh.onrender.com').replace(/\/$/, '');
const SITE_URL = (
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
).replace(/\/$/, '');

const SITE_NAME = 'Opevicky Scents';
const DEFAULT_DESCRIPTION = 'Shop authentic luxury perfumes, perfume oils, scented candles and diffusers in Nigeria. Fast delivery in Lagos and nationwide from Opevicky Scents.';
const WHATSAPP_NUMBER = '2348142600088';
const CONTACT_EMAIL = 'opevickyscents@gmail.com';
const SOCIAL_LINKS = [
    'https://www.tiktok.com/@opevickyscents',
    `https://wa.me/${WHATSAPP_NUMBER}`,
];
const SNAPSHOT_FIELDS = ['_id', 'name', 'price', 'image', 'images', 'description', 'bottleSize', 'stockAmount',
    'isActive', 'isOutOfStock', 'category', 'discountPercentage', 'reviews'];

// ---------- helpers (kept in step with src/utils/formatters.js) ----------
const slugify = (text = '') => String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
const productSlug = (p) => {
    const id = String(p._id || p.id || '');
    const base = slugify(`${p.name || ''} ${p.bottleSize || ''}`);
    return id ? `${base}-${id.slice(-6).toLowerCase()}` : base;
};
const effectivePrice = (p) => (p.discountPercentage > 0 ? p.price - p.price * (p.discountPercentage / 100) : p.price);
const isOutOfStock = (p) => p.isOutOfStock === true || p.stockAmount === 0;
const imageUrl = (p) => {
    const img = (p.images && p.images[0]) || p.image;
    if (!img) return '';
    return img.startsWith('http') ? img : `${API_BASE}/${img}`;
};
const formatPrice = (n) => `₦${Math.round(n).toLocaleString('en-NG')}`;
const escapeHtml = (v) => String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const plainText = (v) => String(v || '').replace(/\s+/g, ' ').trim();
const truncate = (v, max = 160) => {
    const t = plainText(v);
    return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
};
const absolute = (p) => (SITE_URL ? `${SITE_URL}${p}` : p);
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

// ---------- data ----------
const fetchProducts = async () => {
    const url = `${API_BASE}/api/products`;
    for (let attempt = 1; attempt <= 4; attempt += 1) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 60000);
        try {
            const res = await fetch(url, { signal: controller.signal });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            const products = (json.data && json.data.products) || [];
            return products.filter((p) => p.isActive !== false && p.name);
        } catch (error) {
            console.warn(`  prerender: fetching products failed (attempt ${attempt}/4): ${error.message}`);
            if (attempt < 4) await new Promise((r) => setTimeout(r, 5000 * attempt));
        } finally {
            clearTimeout(timer);
        }
    }
    return null;
};

// ---------- HTML ----------
const STYLE = `<style>
.pr{font-family:Inter,system-ui,-apple-system,sans-serif;color:#111;background:#FAFAFA;min-height:100vh}
.pr a{color:inherit}
.pr header{background:#fff;border-bottom:1px solid #e5e5e5;padding:24px;text-align:center}
.pr header a{font-weight:900;letter-spacing:.2em;text-transform:uppercase;text-decoration:none;font-size:22px}
.pr nav{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin-top:12px;font-size:11px;letter-spacing:.15em;text-transform:uppercase}
.pr main{max-width:1100px;margin:0 auto;padding:48px 24px 72px;line-height:1.6}
.pr h1{font-size:32px;font-weight:900;text-transform:uppercase;letter-spacing:-.01em;margin:0 0 16px}
.pr h2{font-size:13px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;margin:40px 0 16px}
.pr p{color:#555;max-width:720px}
.pr ul.grid{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:24px}
.pr ul.grid img{width:100%;aspect-ratio:3/4;object-fit:cover;background:#eee;display:block;margin-bottom:8px}
.pr .price{font-weight:600}
.pr .muted{color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.1em}
.pr .product{display:grid;gap:40px;grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.pr .product img{width:100%;max-width:520px;aspect-ratio:3/4;object-fit:cover;background:#eee}
.pr footer{border-top:1px solid #e5e5e5;padding:32px 24px;text-align:center;font-size:12px;color:#777}
</style>`;

const NAV = [['/', 'Home'], ['/shop', 'Shop'], ['/learn', 'Learn'], ['/about', 'About'], ['/contact', 'Contact']];

const shell = (bodyHtml) => `${STYLE}<div class="pr">
<header><a href="/">Opevicky</a><nav>${NAV.map(([href, label]) => `<a href="${href}">${label}</a>`).join('')}</nav></header>
<main>${bodyHtml}</main>
<footer>&copy; ${new Date().getFullYear()} ${SITE_NAME}. Luxury perfumes, perfume oils, candles and diffusers in Nigeria.
 · <a href="/track">Track your order</a> · <a href="https://wa.me/${WHATSAPP_NUMBER}">WhatsApp</a> · <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></footer>
</div>`;

const productCard = (p) => `<li><a href="/product/${productSlug(p)}">
${imageUrl(p) ? `<img src="${escapeHtml(imageUrl(p))}" alt="${escapeHtml(plainText(p.name))}" loading="lazy" width="300" height="400">` : ''}
<span>${escapeHtml(plainText(p.name))}</span></a><br>
<span class="price">${formatPrice(effectivePrice(p))}</span>${p.discountPercentage > 0 ? ` <s class="muted">${formatPrice(p.price)}</s>` : ''}
${isOutOfStock(p) ? ' <span class="muted">Out of stock</span>' : ''}</li>`;

/** Replaces the head tags and #root content of the built template. */
const renderPage = (template, { title, description, urlPath, image, type = 'website', robots = 'index, follow', structuredData = [], body }) => {
    const url = absolute(urlPath);
    const img = image || absolute('/opvlogo.png');
    const head = [
        `<title>${escapeHtml(title)}</title>`,
        `<meta name="description" content="${escapeHtml(description)}">`,
        `<meta name="robots" content="${robots}">`,
        SITE_URL ? `<link rel="canonical" href="${escapeHtml(url)}">` : '',
        `<meta property="og:site_name" content="${SITE_NAME}">`,
        `<meta property="og:locale" content="en_NG">`,
        `<meta property="og:type" content="${type}">`,
        `<meta property="og:title" content="${escapeHtml(title)}">`,
        `<meta property="og:description" content="${escapeHtml(description)}">`,
        SITE_URL ? `<meta property="og:url" content="${escapeHtml(url)}">` : '',
        `<meta property="og:image" content="${escapeHtml(img)}">`,
        `<meta name="twitter:card" content="summary_large_image">`,
        `<meta name="twitter:title" content="${escapeHtml(title)}">`,
        `<meta name="twitter:description" content="${escapeHtml(description)}">`,
        `<meta name="twitter:image" content="${escapeHtml(img)}">`,
        ...structuredData.map(jsonLd),
    ].filter(Boolean).join('');

    const cleaned = template
        .replace(/<title>[\s\S]*?<\/title>/i, '')
        .replace(/<meta\s+(?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)"[^>]*>/gi, '')
        .replace(/<link\s+rel="canonical"[^>]*>/gi, '');

    if (!/<div id="root"><\/div>/.test(cleaned)) throw new Error('Could not find <div id="root"></div> in build/index.html');
    return cleaned
        .replace('</head>', `${head}</head>`)
        .replace('<div id="root"></div>', `<div id="root">${shell(body)}</div>`);
};

const writePage = (urlPath, html) => {
    const dir = path.join(BUILD_DIR, urlPath === '/' ? '' : urlPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
};

// ---------- pages ----------
const staticPages = (products) => {
    const featured = products.filter((p) => !isOutOfStock(p)).slice(0, 12);
    const categories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();
    const productList = (list) => (list.length ? `<ul class="grid">${list.map(productCard).join('')}</ul>` : '<p>Browse the collection in our shop.</p>');

    return [
        {
            urlPath: '/',
            title: `${SITE_NAME} | Luxury Perfumes & Fragrances in Nigeria`,
            description: DEFAULT_DESCRIPTION,
            structuredData: [
                {
                    '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME,
                    url: absolute('/'), logo: absolute('/opvlogo.png'), email: CONTACT_EMAIL,
                    telephone: `+${WHATSAPP_NUMBER}`, sameAs: SOCIAL_LINKS,
                },
                {
                    '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: absolute('/'),
                    potentialAction: { '@type': 'SearchAction', target: `${absolute('/search')}?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
                },
            ],
            body: `<h1>${SITE_NAME}</h1>
<p>Authentic designer and Arabian perfumes, perfume oils, body mists, scented candles and home diffusers, curated in Lagos and delivered across Nigeria. Founded by Opeyemi Victoria in 2020.</p>
${categories.length ? `<h2>Shop by category</h2><p>${categories.map(escapeHtml).join(' · ')}</p>` : ''}
<h2>Curated signatures</h2>${productList(featured)}
<p><a href="/shop">View the complete range</a></p>
<h2>Learn with Opevicky</h2>
<p>Online and physical training in scented candle making, home and car diffusers, room sprays and gypsum craft, for beginners and aspiring entrepreneurs. <a href="/learn">Explore training</a>.</p>`,
        },
        {
            urlPath: '/shop',
            title: `Shop All Fragrances | ${SITE_NAME}`,
            description: 'Browse our full collection of designer and Arabian perfumes, perfume oils, body mists, scented candles and home diffusers, delivered across Nigeria.',
            structuredData: [{
                '@context': 'https://schema.org', '@type': 'ItemList', name: 'Opevicky Scents collection',
                itemListElement: products.slice(0, 100).map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absolute(`/product/${productSlug(p)}`), name: plainText(p.name) })),
            }],
            body: `<h1>Our Collection</h1><p>${products.length} fragrances and home scents. Discover your signature scent.</p>${productList(products)}`,
        },
        {
            urlPath: '/learn',
            title: `Candle, Diffuser & Gypsum Training | ${SITE_NAME}`,
            description: 'Online and physical training in scented candle making, home and car diffusers, room sprays and gypsum craft. Learn a skill and start a business.',
            body: `<h1>Learn With Opevicky</h1>
<p>Practical training in fragrance creation and gypsum craft with step-by-step guidance for beginners, aspiring entrepreneurs and anyone looking to turn a skill into a business. Online and physical classes available.</p>
<h2>Scented Candle Making</h2><p>One month. Materials, formulation, wax and wick selection, fragrance, finishing, packaging and branding. Online ₦60,000 · Physical ₦85,000.</p>
<h2>Home Diffuser, Car Diffuser &amp; Room Spray</h2><p>One month. Measurements, ingredients, fragrance blending, production, packaging and branding. Online ₦50,000 · Physical ₦75,000.</p>
<h2>Gypsum Craft</h2><p>One month. Mixing, moulding, colouring, painting, sealing and finishing. Online ₦40,000 · Physical ₦70,000.</p>
<h2>Complete Fragrance &amp; Gypsum Business Bundle</h2><p>All five skills plus suppliers' contacts and business guidance. Online ₦155,000 · Physical ₦195,000.</p>
<p><a href="https://wa.me/${WHATSAPP_NUMBER}">Enroll via WhatsApp</a></p>`,
        },
        {
            urlPath: '/about',
            title: `Our Story | ${SITE_NAME}`,
            description: 'How Opevicky Scents grew from one dozen bottles of perfume oil in 2020 into a trusted Nigerian fragrance brand.',
            body: `<h1>The Manifesto</h1>
<p>Opevicky Scents was born out of faith, resilience, and the belief that every great dream starts with a small beginning. Our journey began on 15 May 2020 with just one dozen bottles of perfume oil in Ago Okota, Lagos.</p>
<p>Today we serve customers online and from our growing physical store. Our vision is to become one of Nigeria's most trusted perfume brands, known for authenticity, quality, exceptional customer service and unforgettable fragrances.</p>`,
        },
        {
            urlPath: '/contact',
            title: `Contact Us | ${SITE_NAME}`,
            description: 'Questions about a fragrance, an order or our training? Message Opevicky Scents on WhatsApp, email or our contact form.',
            body: `<h1>Contact Us</h1><p>We usually reply within one business day.</p>
<p>WhatsApp: <a href="https://wa.me/${WHATSAPP_NUMBER}">+${WHATSAPP_NUMBER}</a><br>Email: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></p>
<p>Already ordered? <a href="/track">Track your order</a>.</p>`,
        },
        {
            urlPath: '/track',
            title: `Track Your Order | ${SITE_NAME}`,
            description: 'Check the status of your Opevicky Scents order with your email and order number. No account needed.',
            body: '<h1>Track Your Order</h1><p>Enter the email you used at checkout and the order number from your confirmation email.</p>',
        },
    ];
};

const productPage = (p) => {
    const slug = productSlug(p);
    const name = plainText(p.name);
    const price = effectivePrice(p);
    const soldOut = isOutOfStock(p);
    const images = (p.images && p.images.length ? p.images : [p.image]).filter(Boolean)
        .map((img) => (img.startsWith('http') ? img : `${API_BASE}/${img}`));
    const reviews = Array.isArray(p.reviews) ? p.reviews.filter((r) => Number(r.rating) > 0) : [];
    const avgRating = reviews.length ? reviews.reduce((s, r) => s + Number(r.rating), 0) / reviews.length : 0;
    const details = [p.category, p.bottleSize].map(plainText).filter(Boolean).join(', ');
    const description = truncate(`${name}${details ? ` (${details})` : ''} for ${formatPrice(price)}${soldOut ? ', currently out of stock' : ''}. ${p.description || DEFAULT_DESCRIPTION}`);

    const productData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name,
        sku: String(p._id),
        image: images,
        description: truncate(p.description || description, 5000),
        brand: { '@type': 'Brand', name: SITE_NAME },
        ...(p.category && { category: p.category }),
        ...(p.bottleSize && { size: p.bottleSize }),
        offers: {
            '@type': 'Offer',
            url: absolute(`/product/${slug}`),
            priceCurrency: 'NGN',
            price: Math.round(price),
            availability: soldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@type': 'Organization', name: SITE_NAME },
        },
        ...(reviews.length && {
            aggregateRating: { '@type': 'AggregateRating', ratingValue: avgRating.toFixed(1), reviewCount: reviews.length },
            review: reviews.slice(0, 5).map((r) => ({
                '@type': 'Review',
                author: { '@type': 'Person', name: plainText(r.userName) || 'Customer' },
                reviewRating: { '@type': 'Rating', ratingValue: Number(r.rating), bestRating: 5 },
                reviewBody: truncate(r.text, 500),
            })),
        }),
    };
    const breadcrumbs = {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: absolute('/') },
            { '@type': 'ListItem', position: 2, name: 'Shop', item: absolute('/shop') },
            { '@type': 'ListItem', position: 3, name, item: absolute(`/product/${slug}`) },
        ],
    };

    const descriptionHtml = plainText(p.description)
        ? String(p.description).split(/\n+/).map((line) => line.trim()).filter(Boolean).map((line) => `<p>${escapeHtml(line.replace(/^[-*]\s*/, ''))}</p>`).join('')
        : `<p>${escapeHtml(DEFAULT_DESCRIPTION)}</p>`;

    return {
        urlPath: `/product/${slug}`,
        title: `${name}${details ? ` (${details})` : ''} | ${SITE_NAME}`,
        description,
        image: images[0],
        type: 'product',
        structuredData: [productData, breadcrumbs],
        body: `<p class="muted"><a href="/">Home</a> / <a href="/shop">Shop</a>${p.category ? ` / ${escapeHtml(p.category)}` : ''}</p>
<div class="product">
${images[0] ? `<img src="${escapeHtml(images[0])}" alt="${escapeHtml(name)}" width="520" height="693">` : '<div></div>'}
<div><h1>${escapeHtml(name)}</h1>
<p class="muted">${escapeHtml(details || 'Standard size')}</p>
<p class="price">${formatPrice(price)}${p.discountPercentage > 0 ? ` <s class="muted">${formatPrice(p.price)}</s> (${p.discountPercentage}% off)` : ''}</p>
<p>${soldOut ? 'Out of stock' : 'In stock'}${reviews.length ? ` · Rated ${avgRating.toFixed(1)} out of 5 from ${reviews.length} review${reviews.length === 1 ? '' : 's'}` : ''}</p>
<h2>The details</h2>${descriptionHtml}
<p><a href="/shop">Back to the shop</a></p></div></div>`,
    };
};

// ---------- sitemap / robots ----------
const writeSitemap = (pages) => {
    if (!SITE_URL) {
        console.warn('  prerender: SITE_URL is not set, so sitemap.xml was skipped. Set SITE_URL on Vercel.');
        return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const urls = pages
        .filter((p) => p.urlPath !== '/track')
        .map((p) => {
            const priority = p.urlPath === '/' ? '1.0' : p.urlPath === '/shop' ? '0.9' : p.urlPath.startsWith('/product/') ? '0.8' : '0.6';
            const imageTag = p.image ? `<image:image><image:loc>${escapeHtml(p.image)}</image:loc></image:image>` : '';
            return `<url><loc>${escapeHtml(absolute(p.urlPath))}</loc><lastmod>${today}</lastmod><priority>${priority}</priority>${imageTag}</url>`;
        });
    fs.writeFileSync(path.join(BUILD_DIR, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls.join('\n')}\n</urlset>\n`);
};

const writeRobots = () => {
    const lines = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /cart',
        'Disallow: /checkout',
        'Disallow: /orders',
        'Disallow: /wishlist',
        'Disallow: /auth',
        'Disallow: /orderConfirmation',
        'Disallow: /search',
    ];
    if (SITE_URL) lines.push('', `Sitemap: ${SITE_URL}/sitemap.xml`);
    fs.writeFileSync(path.join(BUILD_DIR, 'robots.txt'), `${lines.join('\n')}\n`);
};

// ---------- main ----------
(async () => {
    const started = Date.now();
    const templatePath = path.join(BUILD_DIR, 'index.html');
    if (!fs.existsSync(templatePath)) {
        console.error('prerender: build/index.html not found. Run react-scripts build first.');
        process.exit(1);
    }
    const template = fs.readFileSync(templatePath, 'utf8');
    console.log(`\nPre-rendering pages (site: ${SITE_URL || 'SITE_URL not set'}, api: ${API_BASE})`);

    // The untouched app shell is the fallback for every route we do not pre-render
    fs.writeFileSync(path.join(BUILD_DIR, 'app-shell.html'), template);

    const fetched = await fetchProducts();
    const products = fetched || [];
    if (!fetched) console.warn('  prerender: could not reach the API; writing pages without products.');

    // Product snapshot used by the site while the live API wakes up
    if (fetched) {
        const snapshot = products.map((p) => Object.fromEntries(SNAPSHOT_FIELDS.filter((k) => p[k] !== undefined).map((k) => [k, p[k]])));
        fs.writeFileSync(path.join(BUILD_DIR, 'products-snapshot.json'), JSON.stringify({ generatedAt: new Date().toISOString(), products: snapshot }));
    }

    const pages = staticPages(products);
    const seen = new Set();
    for (const p of products) {
        const slug = productSlug(p);
        if (!slug || seen.has(slug)) continue;
        seen.add(slug);
        pages.push(productPage(p));
    }

    for (const page of pages) writePage(page.urlPath, renderPage(template, page));
    writeSitemap(pages);
    writeRobots();

    console.log(`  prerender: wrote ${pages.length} pages (${seen.size} products) in ${((Date.now() - started) / 1000).toFixed(1)}s\n`);
})().catch((error) => {
    // Never break the deploy because of SEO extras
    console.error('prerender: failed, the site will still work without pre-rendered pages:', error);
    process.exit(0);
});
