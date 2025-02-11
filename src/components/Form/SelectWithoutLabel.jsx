import PropTypes from "prop-types";
import {IoIosArrowDown} from "react-icons/io";
import {useTranslation} from "react-i18next";

function SelectWithoutLabel({className,title,options,onChange}) {
    const {t} = useTranslation()
    return (
        <div className={"relative flex items-baseline " + className}>
            <select
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-full p-2 text-sub-500 dark:text-gray-400 text-sm bg-transparent border border-soft-200 dark:border-gray-600 rounded-lg appearance-none"
            >
                <option value="filter1 ">{t(title)}</option>
                {
                    options && options.map(option => (
                        <option key={option.id} value={option.id}>{option.name}</option>
                    ))
                }
            </select>
            <div className="absolute inset-y-5 right-2 flex items-center pointer-events-none text-gray-500">
                <IoIosArrowDown />
            </div>
        </div>
    );
}

SelectWithoutLabel.propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    options: PropTypes.array,
    onChange: PropTypes.func,
}

export default SelectWithoutLabel;