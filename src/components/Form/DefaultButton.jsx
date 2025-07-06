import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";


function DefaultButton({title, onClick,className,type}) {
    const {t} = useTranslation()
    return (
        <button onClick={onClick} type={type} className={`flex-1 border-2 dark:border-gray-700 text-sm rounded-xl p-2 text-center ${className}`}>{t(title)}</button>
    );
}

DefaultButton.propTypes = {
    title: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
    type: PropTypes.string,
}

export default DefaultButton;