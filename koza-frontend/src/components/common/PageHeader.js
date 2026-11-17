import React from 'react';

/** Bold page title with a bottom rule, used at the top of most pages. */
const PageHeader = ({ title, subtitle, size = 'md', className = '', children }) => {
    const titleSize = {
        sm: 'text-3xl',
        md: 'text-3xl md:text-4xl',
        lg: 'text-3xl md:text-5xl',
    }[size];

    return (
        <div className={`border-b border-gray-200 dark:border-gray-800 pb-8 mb-12 ${className}`}>
            <h1 className={`${titleSize} font-black uppercase tracking-tight text-[#111] dark:text-white ${subtitle ? 'mb-2' : ''}`}>{title}</h1>
            {subtitle && <p className="text-xs tracking-[0.2em] uppercase text-gray-500">{subtitle}</p>}
            {children}
        </div>
    );
};

export default PageHeader;
