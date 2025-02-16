import PropTypes from "prop-types";
import {IoIosArrowDown} from "react-icons/io";
import {useTranslation} from "react-i18next";
import {FaCircleInfo} from "react-icons/fa6";
import {useEffect, useState} from "react";


function DefaultSelect({ title, options, onChange, classNameContainer,classNameSelect, isOption = false, defaultValue  }) {
    const { t,i18n } = useTranslation();

    const [selectedValue, setSelectedValue] = useState(defaultValue);

    useEffect(() => {
        setSelectedValue(defaultValue);
    }, [defaultValue]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setSelectedValue(newValue);
        onChange(newValue);
    };

    return (
        <div className={classNameContainer}>
            {
                title &&
                <label htmlFor="select-input"
                       className="text-sm text-start text-gray-700 flex items-center gap-1 mb-2 dark:text-gray-200">
                    <span> {t(title)} </span>
                    {isOption && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                        ({t("Option")}) <FaCircleInfo className="text-gray-400" size={15}/>
                    </span>
                    )}
                </label>
            }

            <div className="relative">
                <select
                    onChange={handleChange}
                    id="select-input"
                    className={`appearance-none box-border dark:bg-white-0 dark:text-primary-150 w-full border border-gray-300 dark:border-gray-500  rounded-[10px] truncate  bg-white ${classNameSelect ? classNameSelect :"text-gray-500 py-[10px] p-3 text-xs"} shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    value={selectedValue}
                >
                    {options.map((option) => (
                        <option key={option.id} value={option.id}>
                            {t(option.value)}
                        </option>
                    ))}
                </select>
                <div className={`absolute inset-y-0 ${i18n.language === 'en' ? "right-3" :"left-3"}  flex items-center pointer-events-none`}>
                    <IoIosArrowDown />
                </div>
            </div>
        </div>
    );
}

DefaultSelect.propTypes = {
    title: PropTypes.string,
    isOption: PropTypes.bool,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    classNameContainer: PropTypes.string,
    classNameSelect: PropTypes.string,
    defaultValue: PropTypes.string
};

export default DefaultSelect;
