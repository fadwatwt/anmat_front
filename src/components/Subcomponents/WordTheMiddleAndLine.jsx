
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

function WordTheMiddleAndLine({word,classNameText}) {
    const {t} = useTranslation()
    return (
        <div className="w-full flex items-center my-4">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            {
                word ?
                    <span className={"mx-4 text-gray-400 dark:border-gray-400 " + classNameText}>{t(word)}</span>
                    :null
            }
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>
    );
}

WordTheMiddleAndLine.propTypes = {
    word: PropTypes.string,
    classNameText: PropTypes.string,
}

export default WordTheMiddleAndLine;