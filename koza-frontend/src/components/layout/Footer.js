import React from 'react';
import { socialLinks } from '../../data/siteData';
import { icons } from '../icons';

const footerColumns = [
    {
        heading: 'Collections',
        links: [
            { label: 'All Perfumes', page: 'shop' },
            { label: 'New Arrivals', page: 'shop' },
        ],
    },
    {
        heading: 'Client Services',
        links: [
            { label: 'Contact Us', page: 'contact' },
            { label: 'Our Story', page: 'about' },
        ],
    },
];

// --- Footer: High End Minimalist ---
const Footer = ({ onNavigate }) => (
    <footer className="bg-[#111] text-white pt-24 pb-12 border-t border-gray-900">
        <div className="max-w-screen-2xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
                <div className="col-span-1 md:col-span-2">
                    <h2 className="text-2xl font-black tracking-[0.2em] uppercase mb-6">Opevicky</h2>
                    <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                        Curating the finest luxury fragrances. Elevate your presence and leave a lasting impression wherever you go.
                    </p>
                </div>
                {footerColumns.map((column) => (
                    <div key={column.heading}>
                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">{column.heading}</h3>
                        <ul className="space-y-4">
                            {column.links.map((link) => (
                                <li key={link.label}>
                                    <button onClick={() => onNavigate(link.page)} className="text-sm text-gray-300 hover:text-white transition-colors">{link.label}</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800 text-xs text-gray-500 uppercase tracking-widest">
                <p>&copy; {new Date().getFullYear()} OpevickyScents. All Rights Reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                    {socialLinks.map(({ label, href, icon, internal }) => {
                        const Icon = icons[icon];
                        const externalProps = internal ? {} : { target: '_blank', rel: 'noopener noreferrer' };
                        return (
                            <a key={label} href={href} {...externalProps} className="hover:text-white transition-colors" aria-label={label}>
                                <Icon />
                            </a>
                        );
                    })}
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
