import { API_BASE_URL } from '../config';

export const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://placehold.co/400x400/cccccc/333333?text=No+Image';
    return imagePath.startsWith('http') ? imagePath : `${API_BASE_URL}/${imagePath}`;
};

// Builds a CSV file from rows (arrays of values) and downloads it
export const downloadCsv = (filename, rows) => {
    const escapeCell = (value) => {
        const text = value === null || value === undefined ? '' : String(value);
        const safe = /^[=+\-@]/.test(text) ? `'${text}` : text; // stop spreadsheet formula injection
        return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
    };
    const csv = rows.map((row) => row.map(escapeCell).join(',')).join('\r\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
};
