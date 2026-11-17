// Escapes user-supplied text before it is placed inside an HTML email.
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

const escapeHtml = (value) =>
    value === undefined || value === null ? '' : String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);

/** Escapes characters that have special meaning in a regular expression. */
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = { escapeHtml, escapeRegex };
