import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import PropTypes from "prop-types";

const Rating = ({ value, showPercentage = true }) => {
    const maxStars = 5;
    const percentage = (value / 100) * maxStars;
    const stars = Array.from({ length: maxStars }, (_, index) => {
        if (percentage >= index + 1) {
            return <FaStar key={index} className="text-yellow-400" />;
        } else if (percentage > index && percentage < index + 1) {
            return <FaStarHalfAlt key={index} className="text-yellow-400" />;
        } else {
            return <FaRegStar key={index} className="text-yellow-400" />;
        }
    });

    return (
        <div className="flex items-center space-x-1">
            {stars}
            {showPercentage && <span className="ml-2 text-gray-700 dark:text-gray-200">{value}%</span>}
        </div>
    );
};

Rating.propTypes = {
    value:PropTypes.string.isRequired,
    showPercentage:PropTypes.bool
}

export default Rating;
