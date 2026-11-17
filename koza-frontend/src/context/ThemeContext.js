import React, { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS } from '../config/constants';
import { getItem, setItem } from '../utils/storage';

const ThemeContext = createContext({ theme: 'light', toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => getItem(STORAGE_KEYS.THEME, 'light'));

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        setItem(STORAGE_KEYS.THEME, theme);
    }, [theme]);

    const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
