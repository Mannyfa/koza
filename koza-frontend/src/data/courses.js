import { WHATSAPP_NUMBER } from '../config/constants';

// Each course renders as one block on the Learn page.
// `id` and `prices[].amount` (Naira) must match koza-hair-backend/utils/courses.js,
// which holds the prices customers are actually charged.
// `sections[].columns` is an array of bullet lists; two lists render side by side.
export const courses = [
    {
        id: 'candle-making',
        number: '01',
        tag: 'Foundation',
        title: 'Scented Candle Making',
        duration: '1 Month Training',
        description: 'Learn how to create quality scented candles from scratch, understand the materials and formulations, choose the right wax and wick, work with fragrances, troubleshoot common candle-making issues, and properly finish, package and brand your products.',
        sections: [
            {
                heading: 'Curriculum Includes',
                columns: [[
                    'Step-by-step training',
                    'Materials & ingredients guide',
                    'Formulation guidance',
                    'Candle finishing & packaging',
                    'Suppliers’ contacts',
                ]],
            },
        ],
        prices: [
            { label: 'Online Class', format: 'online', amount: 60000 },
            { label: 'Physical Class', format: 'physical', amount: 85000 },
        ],
    },
    {
        id: 'diffuser-room-spray',
        number: '02',
        tag: 'Ambient Scents',
        title: 'Home Diffuser, Car Diffuser & Room Spray',
        duration: '1 Month Training',
        description: 'Learn how to formulate and produce home diffusers, car diffusers and room sprays, including proper measurements, ingredient selection, fragrance blending, production techniques, troubleshooting, packaging and basic branding.',
        sections: [
            {
                heading: 'Curriculum Includes',
                columns: [[
                    'Step-by-step training',
                    'Formulation guidance',
                    'Ingredients & materials guide',
                    'Packaging & branding guidance',
                    'Suppliers’ contacts',
                ]],
            },
        ],
        prices: [
            { label: 'Online Class', format: 'online', amount: 50000 },
            { label: 'Physical Class', format: 'physical', amount: 75000 },
        ],
    },
    {
        id: 'gypsum-craft',
        number: '03',
        tag: 'Artistry',
        title: 'Gypsum Craft',
        duration: '1 Month Training',
        description: 'Learn the fundamentals of gypsum craft, from preparing and mixing gypsum to moulding, colouring, finishing, painting, sealing and creating beautifully finished pieces.',
        sections: [
            {
                heading: 'Curriculum Includes',
                columns: [
                    ['Step-by-step training', 'Materials & tools guide', 'Moulding techniques', 'Colouring & finishing'],
                    ['Painting & detailing', 'Sealing techniques', 'Suppliers’ contacts'],
                ],
            },
        ],
        prices: [
            { label: 'Online Class', format: 'online', amount: 40000 },
            { label: 'Physical Class', format: 'physical', amount: 70000 },
        ],
    },
    {
        id: 'business-bundle',
        number: '04',
        tag: 'The Masterclass',
        title: 'Complete Fragrance & Gypsum Business Bundle',
        duration: '1 Month Training',
        featured: true,
        description: 'A complete training package designed for anyone who wants to learn multiple profitable product-making skills and build a fragrance and home décor business from the ground up.',
        sections: [
            {
                heading: 'Courses Included',
                columns: [[
                    'Scented Candle Making',
                    'Home Diffuser Making',
                    'Car Diffuser Making',
                    'Room Spray Making',
                    'Gypsum Craft',
                ]],
            },
            {
                heading: "What You'll Learn",
                columns: [
                    [
                        'Complete introduction to each product',
                        'Materials, tools and ingredients required',
                        'Understanding ingredients and their functions',
                        'Formulation and proper measurements',
                        'Step-by-step production processes',
                        'Fragrance selection and blending',
                    ],
                    [
                        'Wick selection and candle-making techniques',
                        'Moulding, colouring and finishing for gypsum',
                        'Troubleshooting common production problems',
                        'Product finishing, packaging and presentation',
                        'Basic branding and labelling',
                        'How to prepare your products for sale',
                    ],
                ],
            },
            {
                heading: 'Bonus Inclusions',
                columns: [[
                    'Suppliers’ contacts and numbers for ingredients and materials',
                    'Materials & ingredients guide',
                    'Formulation guidance',
                    'Packaging & branding guidance',
                    'Business guidance for starting and selling your products',
                ]],
            },
        ],
        prices: [
            { label: 'Online Bundle', format: 'online', amount: 155000, note: 'Learn all five skills from the comfort of your home.' },
            { label: 'Physical Bundle', format: 'physical', amount: 195000, note: 'Get the complete five-course training with hands-on practical sessions.' },
        ],
    },
];

export const learningFormats = [
    { title: 'Online Training', description: 'Learn from wherever you are, at your own pace with full digital access.' },
    { title: 'Physical Training', description: 'Get hands-on guidance and practical experience in person. (Additional fee applies).' },
];

export const ENROLL_WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hello,%20I'm%20interested%20in%20enrolling%20in%20the%20Opevicky%20Training%20Program.`;
