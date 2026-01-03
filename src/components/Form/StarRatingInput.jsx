import { FaStar } from "react-icons/fa";
import PropTypes from "prop-types";

function StarRatingInput({ title, value, onChange }) {
    return (
        <div className="w-full flex flex-col items-start gap-2">
            <p className="text-sm text-gray-900 dark:text-gray-200">{title}</p>
            <div className="flex justify-around w-full  dark:bg-gray-800/50 p-3 rounded-xl">
                {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                        key={star}
                        size={28}
                        className={`cursor-pointer transition-transform active:scale-90 ${
                            value >= star ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"
                        }`}
                        onClick={() => onChange(star)}
                    />
                ))}
            </div>
        </div>
    );
}

StarRatingInput.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default StarRatingInput;