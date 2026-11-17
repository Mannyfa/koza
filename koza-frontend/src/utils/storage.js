// Safe wrappers around localStorage so a blocked or corrupted store never crashes the app.

export const getItem = (key, fallback = null) => {
    try {
        const value = localStorage.getItem(key);
        return value ?? fallback;
    } catch {
        return fallback;
    }
};

export const setItem = (key, value) => {
    try {
        localStorage.setItem(key, value);
    } catch {
        /* storage unavailable */
    }
};

export const removeItem = (key) => {
    try {
        localStorage.removeItem(key);
    } catch {
        /* storage unavailable */
    }
};

export const getJSON = (key, fallback = null) => {
    const raw = getItem(key);
    if (raw === null) return fallback;
    try {
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
};

export const setJSON = (key, value) => setItem(key, JSON.stringify(value));
