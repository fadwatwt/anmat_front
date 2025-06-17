
import PropTypes from "prop-types";
import {IoMdStarOutline} from "react-icons/io";
import {IoStar, IoStarHalf, IoStarOutline} from "react-icons/io5";
import {useTranslation} from "react-i18next";

const StarRating = ({ rating,onClickRate }) => {
    const totalStars = 5;
    const {t} = useTranslation()

    if (rating === null || rating === undefined) {
        return (
            <button onClick={onClickRate} className="p-1.5 flex items-center gap-0.5 border rounded-lg border-soft-200 dark:border-gray-700">
                <IoMdStarOutline className="text-yellow-400" size={20} />
                <span className="text-sm text-sub-500 px-1 dark:text-sub-300">{t("Rate")}</span>
            </button>
        );
    }

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= totalStars; i++) {
            if (rating >= i) {
                stars.push(<IoStar  key={i} className="text-yellow-500 text-sm" />); // نجمة كاملة
            } else if (rating >= i - 0.5) {
                stars.push(<IoStarHalf  key={i} className="text-yellow-500 text-sm" />); // نصف نجمة
            } else {
                stars.push(<IoStarOutline  key={i} className="text-gray-300 text-sm" />); // نجمة فارغة
            }
        }
        return stars;
    };

    return (
        <div className="flex items-center gap-1.5">
            {renderStars()}
            <span className="ml-2 text-gray-600 dark:text-gray-300 text-sm">{rating?.toFixed(1)}</span>
        </div>
    );
};

// تعريف PropTypes
StarRating.propTypes = {
    rating: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.oneOf([null, undefined])
    ]).isRequired,
    onClickRate:PropTypes.func
};

export default StarRating;
