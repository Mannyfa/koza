import React from 'react';
import { formatPrice } from '../../utils/formatters';

const GOLD = 'text-[#D4AF37]';

const BulletList = ({ items }) => (
    <ul className="text-xs text-gray-500 space-y-3">
        {items.map((item) => (
            <li key={item} className="flex items-start"><span className={`mr-3 ${GOLD}`}>•</span> {item}</li>
        ))}
    </ul>
);

const CourseSection = ({ heading, columns, withDivider }) => (
    <div className={withDivider ? 'pt-4 border-t border-gray-200 dark:border-gray-800' : ''}>
        <h4 className="text-[10px] font-bold tracking-widest uppercase text-[#111] dark:text-white mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">{heading}</h4>
        {columns.length > 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {columns.map((items, i) => <BulletList key={i} items={items} />)}
            </div>
        ) : (
            <BulletList items={columns[0]} />
        )}
    </div>
);

/** One course row on the Learn page. `featured` applies the gold bundle styling. */
const CourseCard = ({ course, onEnroll }) => {
    const { number, tag, title, duration, description, sections, prices, featured } = course;

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            <div className="md:col-span-4">
                <p className={`text-[10px] font-bold tracking-[0.3em] uppercase mb-4 ${featured ? GOLD : 'text-gray-400'}`}>{`${number} // ${tag}`}</p>
                <h2 className="text-2xl font-medium text-[#111] dark:text-white mb-2 leading-tight">{title}</h2>
                <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">{duration}</p>
            </div>
            <div className="md:col-span-8">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-8">{description}</p>

                <div className={`space-y-6 bg-white dark:bg-[#111] border p-6 sm:p-8 mb-8 ${featured ? 'border-[#D4AF37]/50' : 'border-gray-200 dark:border-gray-800'}`}>
                    {sections.map((section, i) => (
                        <CourseSection key={section.heading} {...section} withDivider={i > 0} />
                    ))}
                </div>

                <div className={`flex flex-col sm:flex-row gap-4 border-t pt-6 ${featured ? 'border-[#D4AF37]/30' : 'border-gray-200 dark:border-gray-800'}`}>
                    {prices.map((price) => (
                        <div className="flex-1" key={price.label}>
                            <p className={`text-[10px] uppercase tracking-widest mb-1 ${featured ? `${GOLD} font-bold` : 'text-gray-400'}`}>{price.label}</p>
                            <p className={`text-xl font-medium text-[#111] dark:text-white ${price.note ? 'mb-2' : ''}`}>{formatPrice(price.amount)}</p>
                            {price.note && <p className="text-xs text-gray-500">{price.note}</p>}
                            {onEnroll && (
                                <button type="button" onClick={() => onEnroll(course, price.format)}
                                    aria-label={`Enroll in ${title}, ${price.label}`}
                                    className={`mt-4 px-6 py-3 text-[10px] font-bold tracking-[0.2em] uppercase border transition-colors rounded-none ${featured
                                        ? 'border-[#D4AF37] text-[#111] dark:text-white hover:bg-[#D4AF37] hover:text-[#111]'
                                        : 'border-[#111] dark:border-white text-[#111] dark:text-white hover:bg-[#111] hover:text-white dark:hover:bg-white dark:hover:text-[#111]'}`}>
                                    Enroll &amp; Pay
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
