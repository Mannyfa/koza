import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { pageMotionProps } from '../animations/variants';
import CourseCard from '../components/learn/CourseCard';
import EnrollModal from '../components/learn/EnrollModal';
import { courses, ENROLL_WHATSAPP_URL, learningFormats } from '../data/courses';
import { btnPrimary, card, pageShell } from '../styles/classNames';

// --- Learn Page (Masterclass Layout) ---
const LearnPage = ({ currentUser }) => {
    const [selection, setSelection] = useState(null); // { course, format } while the enroll dialog is open
    const closeEnroll = useCallback(() => setSelection(null), []);

    return (
    <motion.div {...pageMotionProps} className={pageShell}>
        <div className="max-w-screen-lg mx-auto px-6 lg:px-12">

            <div className="text-center border-b border-gray-200 dark:border-gray-800 pb-16 mb-16">
                <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-6">Online & Physical Training</h3>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-[#111] dark:text-white mb-8">Learn With Opevicky</h1>
                <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-2xl mx-auto">
                    Learn practical skills in fragrance creation and gypsum craft with step-by-step guidance designed for beginners, aspiring entrepreneurs, and anyone looking to turn a skill into a business.
                </p>
            </div>

            <div className="space-y-24">
                {courses.map((course, i) => (
                    <React.Fragment key={course.number}>
                        {i > 0 && <div className="w-full h-px bg-gray-200 dark:bg-gray-800"></div>}
                        <CourseCard course={course} onEnroll={(c, format) => setSelection({ course: c, format })} />
                    </React.Fragment>
                ))}
            </div>

            {/* Global CTA */}
            <div className={`mt-32 text-center p-12 sm:p-20 ${card}`}>
                <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400 mb-6">Choose Your Learning Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto mb-12">
                    {learningFormats.map((format) => (
                        <div key={format.title}>
                            <p className="text-[10px] font-bold tracking-widest uppercase text-[#111] dark:text-white mb-2">{format.title}</p>
                            <p className="text-xs text-gray-500 leading-relaxed">{format.description}</p>
                        </div>
                    ))}
                </div>

                <p className="text-xl font-medium text-[#111] dark:text-white mb-10 leading-relaxed max-w-xl mx-auto italic">
                    "Learn the skill. Create with confidence. Build your brand."
                </p>

                <a href={ENROLL_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={`inline-block px-12 py-5 duration-300 ${btnPrimary}`}>
                    Ask a Question on WhatsApp
                </a>
                <p className="text-xs text-gray-500 mt-6">Ready to start? Choose a class above and tap <strong>Enroll &amp; Pay</strong> to pay securely with Paystack.</p>
            </div>
        </div>

        <EnrollModal selection={selection} defaultEmail={currentUser?.email || ''} onClose={closeEnroll} />
    </motion.div>
    );
};

export default LearnPage;
