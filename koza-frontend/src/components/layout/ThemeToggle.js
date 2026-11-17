import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { MoonIcon, SunIcon } from '../icons';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} className="hover:opacity-50 transition-opacity" aria-label="Toggle theme">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
    );
};

export default ThemeToggle;
