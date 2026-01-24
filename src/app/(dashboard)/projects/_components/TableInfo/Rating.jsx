import React from "react";
import PropTypes from "prop-types";
import { RiStarFill, RiStarHalfFill, RiStarLine } from "@remixicon/react";

function Rating({ rating, maxRating = 5 }) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex items-center gap-1">
            <div className="flex text-yellow-400">
                {[...Array(fullStars)].map((_, i) => (
                    <RiStarFill key={`full-${i}`} size={16} />
                ))}
                {hasHalfStar && <RiStarHalfFill size={16} />}
                {[...Array(emptyStars)].map((_, i) => (
                    <RiStarLine key={`empty-${i}`} size={16} className="text-gray-300 dark:text-gray-600" />
                ))}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                {rating}
            </span>
        </div>
    );
}

Rating.propTypes = {
    rating: PropTypes.number.isRequired,
    maxRating: PropTypes.number,
};

export default Rating;
