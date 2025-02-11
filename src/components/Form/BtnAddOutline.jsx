
import {FiPlus} from "react-icons/fi";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

function BtnAddOutline({title,onClick}) {
    const {t} = useTranslation()
    return (
        <button
            onClick={onClick}
            className={"w-full p-[10px] rounded-[10px] justify-center items-center border border-primary-base dark:border-primary-200 flex gap-1"}>
            <FiPlus className={"text-primary-base dark:text-primary-200"} size={13}/>
            <span className={"text-md text-primary-base dark:text-primary-200"}>{t(title)}</span>
        </button>
    );
}

BtnAddOutline.propTypes = {
    title:PropTypes.string.isRequired,
    onClick:PropTypes.func
}

export default BtnAddOutline;