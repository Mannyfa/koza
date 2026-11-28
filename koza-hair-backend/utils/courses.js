// Training courses sold on the storefront's "Learn with Opevicky" page.
// These prices are the ones customers are charged: the storefront's copy in
// koza-frontend/src/data/courses.js is only for display, so change both together.

const { OrderError } = require('./orderPricing');

const COURSES = [
    { id: 'candle-making', title: 'Scented Candle Making', prices: { online: 60000, physical: 85000 } },
    { id: 'diffuser-room-spray', title: 'Home Diffuser, Car Diffuser & Room Spray', prices: { online: 50000, physical: 75000 } },
    { id: 'gypsum-craft', title: 'Gypsum Craft', prices: { online: 40000, physical: 70000 } },
    { id: 'business-bundle', title: 'Complete Fragrance & Gypsum Business Bundle', prices: { online: 155000, physical: 195000 } },
];

const FORMAT_LABELS = { online: 'Online', physical: 'Physical' };

/** Looks up the price (in Naira) for a course and class format, or throws OrderError. */
const priceCourse = (courseId, format) => {
    const course = COURSES.find((c) => c.id === courseId);
    if (!course) throw new OrderError('This course is not available. Please refresh the page and try again.');
    if (!Object.prototype.hasOwnProperty.call(course.prices, format)) {
        throw new OrderError('Please choose an online or physical class.');
    }
    return { course, format, formatLabel: FORMAT_LABELS[format], amount: course.prices[format] };
};

const STUDENT_FIELDS = ['name', 'email', 'phone'];

const cleanStudent = (student = {}) => {
    const cleaned = {};
    for (const field of STUDENT_FIELDS) {
        const value = typeof student[field] === 'string' ? student[field].trim().slice(0, 200) : '';
        if (!value) throw new OrderError(`Missing student ${field}.`);
        cleaned[field] = value;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) throw new OrderError('Please enter a valid email address.');
    return cleaned;
};

const ENROLLMENT_STATUSES = ['Paid', 'Contacted', 'Completed', 'Refunded'];

module.exports = { COURSES, priceCourse, cleanStudent, ENROLLMENT_STATUSES };
