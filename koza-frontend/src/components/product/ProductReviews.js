import React, { useState } from 'react';
import { btnPrimary } from '../../styles/classNames';
import { formatDate } from '../../utils/formatters';
import { ShoppingBagIcon } from '../icons';
import StarRating from './StarRating';

const ReviewForm = ({ onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit({ rating, text });
        setText('');
        setRating(5);
    };

    return (
        <div className="border border-[#111] dark:border-gray-800 p-8 bg-white dark:bg-[#0A0A0A] rounded-none sticky top-32">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#111] dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">Leave a Review</h3>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Rating</p>
                    <StarRating value={rating} onChange={setRating} starClassName="h-6 w-6" className="flex gap-2" />
                </div>
                <div className="mb-8">
                    <label htmlFor="review-text" className="block text-xs uppercase tracking-widest text-gray-500 mb-3">Experience</label>
                    <textarea id="review-text" required rows="4" value={text} onChange={(e) => setText(e.target.value)} placeholder="Share your thoughts..." className="w-full p-4 border border-gray-300 dark:border-gray-700 bg-transparent text-[#111] dark:text-white rounded-none focus:border-[#111] dark:focus:border-white focus:outline-none transition-colors text-sm"></textarea>
                </div>
                <button type="submit" className={`w-full py-4 ${btnPrimary}`}>Submit Review</button>
            </form>
        </div>
    );
};

const ProductReviews = ({ reviews, canReview, onSubmitReview }) => (
    <div className="border-t border-[#111] dark:border-gray-800 pt-24">
        <h2 className="text-2xl font-medium tracking-tight text-[#111] dark:text-white mb-12">Client Feedback</h2>

        <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-4 mb-12 lg:mb-0">
                {reviews.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">No reviews yet. Be the first to share your experience.</p>
                ) : (
                    reviews.map((review, index) => (
                        <div key={review._id || index} className="bg-[#F9F9F9] dark:bg-[#111] p-8 border border-gray-200 dark:border-gray-800 rounded-none">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="font-bold text-xs uppercase tracking-widest text-[#111] dark:text-white">{review.userName}</p>
                                    <p className="text-xs text-gray-500 mt-1">{formatDate(review.createdAt || review.date || new Date())}</p>
                                </div>
                                <StarRating value={review.rating} starClassName="h-3 w-3" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{review.text}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="lg:col-span-5">
                {canReview ? (
                    <ReviewForm onSubmit={onSubmitReview} />
                ) : (
                    <div className="border border-gray-200 dark:border-gray-800 p-12 bg-[#F9F9F9] dark:bg-[#111] rounded-none text-center">
                        <div className="mx-auto w-12 h-12 text-gray-400 mb-6 flex justify-center items-center"><ShoppingBagIcon /></div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-[#111] dark:text-white mb-2">Verified Clients Only</h3>
                        <p className="text-sm text-gray-500">Reviews are reserved for accounts that have purchased this item.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default ProductReviews;
