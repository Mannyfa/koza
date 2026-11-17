import React from 'react';
import { StarIcon, StarOutlineIcon } from '../icons';

const STARS = [1, 2, 3, 4, 5];

/**
 * Five-star display. When `onChange` is provided the stars become buttons.
 */
const StarRating = ({ value = 5, onChange, starClassName = 'h-4 w-4', className = 'flex text-[#111] dark:text-white' }) => (
    <div className={className}>
        {STARS.map((star) => {
            const Icon = star <= value ? StarIcon : StarOutlineIcon;
            if (!onChange) return <Icon key={star} className={starClassName} />;
            return (
                <button type="button" key={star} onClick={() => onChange(star)} aria-label={`${star} star${star > 1 ? 's' : ''}`} className="text-[#111] dark:text-white focus:outline-none transition-transform hover:scale-110">
                    <Icon className={starClassName} />
                </button>
            );
        })}
    </div>
);

export default StarRating;
