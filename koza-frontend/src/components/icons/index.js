import React from 'react';

// Shared wrapper for stroke-style (outline) icons.
const Outline = ({ className, strokeWidth = 1.5, children }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}>
        {children}
    </svg>
);

const path = (d) => <path strokeLinecap="round" strokeLinejoin="round" d={d} />;

export const SearchIcon = ({ className = 'h-5 w-5' }) => <Outline className={className}>{path('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z')}</Outline>;
export const UserIcon = ({ className = 'h-5 w-5' }) => <Outline className={className}>{path('M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z')}</Outline>;
export const ShoppingBagIcon = ({ className = 'h-5 w-5' }) => <Outline className={className}>{path('M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z')}</Outline>;
export const MenuIcon = ({ className = 'h-6 w-6' }) => <Outline className={className}>{path('M4 6h16M4 12h16m-7 6h7')}</Outline>;
export const XIcon = ({ className }) => <Outline className={`h-6 w-6 ${className || ''}`}>{path('M6 18L18 6M6 6l12 12')}</Outline>;
export const CheckCircleIcon = ({ className = 'h-16 w-16 text-[#111] dark:text-white mx-auto' }) => <Outline className={className}>{path('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z')}</Outline>;
export const MoonIcon = ({ className = 'h-5 w-5' }) => <Outline className={className}>{path('M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z')}</Outline>;
export const SunIcon = ({ className = 'h-5 w-5' }) => <Outline className={className}>{path('M12 3v1m0 16v1m8.485-8.485l-.707.707M5.222 5.222l-.707.707M12 12a4 4 0 100-8 4 4 0 000 8zM21 12h-1M4 12H3m16.778 6.778l-.707-.707M6.929 18.778l-.707-.707')}</Outline>;
export const ReceiptIcon = ({ className = 'h-8 w-8' }) => <Outline className={className}>{path('M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z')}</Outline>;
export const ChevronDownIcon = ({ className }) => <Outline className={className}>{path('M19 9l-7 7-7-7')}</Outline>;
export const MailIcon = ({ className = 'h-5 w-5' }) => <Outline className={className}>{path('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z')}</Outline>;
export const TwitterIcon = ({ className = 'h-5 w-5' }) => <Outline className={className}>{path('M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z')}</Outline>;

export const SparklesIcon = ({ className = 'h-8 w-8' }) => (
    <Outline className={className}>
        {path('M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L12 12l-2.293-2.293a1 1 0 010-1.414L12 6z')}
        {path('M12 12l2.293 2.293a1 1 0 010 1.414L12 18l-2.293-2.293a1 1 0 010-1.414L12 12zM21 12a9 9 0 11-18 0 9 9 0 0118 0z')}
    </Outline>
);
export const ScissorsIcon = ({ className = 'h-8 w-8' }) => <Outline className={className}>{path('M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879a1 1 0 01-1.414 0L9 12m0 0l2.879-2.879a1 1 0 011.414 0L16 12M4 4v.01M4 8v.01M4 12v.01M4 16v.01M8 4v.01M12 4v.01M16 4v.01')}</Outline>;
export const TruckIcon = ({ className = 'h-8 w-8' }) => (
    <Outline className={className}>
        <path strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
        {path('M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8l2-2zM13 16l2 2h3.5a1 1 0 001-1.447l-2-4A1 1 0 0016.5 9H13v7z')}
    </Outline>
);
export const ChatBubbleIcon = ({ className = 'h-8 w-8' }) => <Outline className={className}>{path('M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z')}</Outline>;
export const InstagramIcon = ({ className = 'h-5 w-5' }) => (
    <Outline className={className}>
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path strokeWidth={1} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01" />
    </Outline>
);

export const HeartIcon = ({ className, isFilled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill={isFilled ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        {path('M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z')}
    </svg>
);

// --- Solid icons ---
export const StarIcon = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);
export const StarOutlineIcon = ({ className }) => (
    <Outline className={className}>{path('M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z')}</Outline>
);
export const ChevronLeftIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className || ''}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);
export const ChevronRightIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className || ''}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);
export const TiktokIcon = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.22-1.15 4.33-2.9 5.6-1.8 1.34-4.22 1.76-6.4 1.15-2.26-.6-4.2-2.3-4.9-4.52-.75-2.22-.38-4.78 1.07-6.66 1.4-1.83 3.65-2.88 5.92-2.98.01 1.37.01 2.73.01 4.1-.9-.05-1.81.21-2.52.75-.72.54-1.18 1.36-1.28 2.25-.1 1.01.19 2.05.8 2.8.62.77 1.62 1.2 2.63 1.21 1.11.02 2.2-.39 3.01-1.11.75-.68 1.22-1.65 1.28-2.65.04-5.63.02-11.26.03-16.89z" />
    </svg>
);
export const WhatsAppIcon = ({ className = 'h-5 w-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.031 21c-1.566 0-3.08-.42-4.42-1.215l-1.04-.616-4.912 1.285 1.312-4.786-.676-1.074C1.455 13.149 1 11.597 1 10.007 1 4.49 5.485 0 11.996 0 18.51 0 23 4.49 23 10.007c0 5.517-4.49 10.993-10.969 10.993zm-5.61-3.136c1.336.791 2.89 1.21 4.505 1.21 5.378 0 9.756-4.37 9.756-9.755 0-5.385-4.378-9.754-9.756-9.754-5.378 0-9.756 4.369-9.756 9.754 0 1.706.446 3.35 1.294 4.81l.135.228-1.075 3.92 4.025-1.053.255.148c.003 0 .003-.001.004-.002zm6.27-11.56c-.244-.543-.5-.554-.728-.564-.188-.008-.403-.008-.618-.008-.215 0-.564.08-.859.397-.295.317-1.127 1.101-1.127 2.686 0 1.585 1.154 3.118 1.315 3.33.161.212 2.274 3.469 5.512 4.869.771.332 1.373.531 1.841.679.774.246 1.48.211 2.035.128.623-.095 1.916-.782 2.185-1.538.268-.755.268-1.402.188-1.538-.08-.135-.295-.215-.618-.374-.322-.159-1.916-.946-2.211-1.052-.295-.106-.51-.159-.725.158-.215.318-.838 1.053-1.026 1.265-.188.212-.376.238-.698.08-.322-.159-1.368-.503-2.607-1.61-.963-.861-1.614-1.925-1.802-2.242-.188-.318-.02-.49.141-.649.145-.143.322-.375.483-.564.161-.188.215-.317.322-.531.107-.212.054-.397-.027-.556-.08-.159-.725-1.748-.994-2.392z" />
    </svg>
);

// Lookup map for data-driven icons (see data/siteData.js)
export const icons = {
    SparklesIcon, ScissorsIcon, TruckIcon, ChatBubbleIcon,
    InstagramIcon, TiktokIcon, TwitterIcon, WhatsAppIcon, MailIcon,
};
