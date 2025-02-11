import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

function WordTheMiddleAndLine({word}) {
    const {t} = useTranslation()
    return (
        <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            {
                word ?
                    <span className="mx-4 text-gray-400 dark:border-gray-400">{t(word)}</span>
                    :null
            }
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>
    );
}

WordTheMiddleAndLine.propTypes = {
    word: PropTypes.string
}

export default WordTheMiddleAndLine;