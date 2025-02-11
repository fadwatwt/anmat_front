
import PropTypes from "prop-types";
import {TfiCalendar} from "react-icons/tfi";
import {useRef} from "react";
import {useTranslation} from "react-i18next";

function DateInput({className,id,classNameLabel,onChange,title,name,value}) {
    const {t,i18n} = useTranslation()
    const inputDateRef = useRef(null)
    const handelOpenPicker = () =>{
        inputDateRef.current.showPicker()
    }
    return (
        <div className={"flex flex-col items-start gap-2 " + className}>
            <p className={"text-sm dark:text-white"}> {t(title)}</p>
            <label
                className={"flex pl-2 px-2 w-full items-center text-xs dark:bg-white-0 dark:border-gray-700 border-2 rounded-xl  focus:outline-none focus:border-blue-500 dark:text-gray-200 " + classNameLabel}
                htmlFor={id}>
                <TfiCalendar className={"cursor-pointer"} onClick={handelOpenPicker}   size={18} />
                <input  ref={inputDateRef} type={"date"} className={" custom-date-input dark:bg-white-0 w-full py-3 px-2 outline-none appearance-none focus:outline-none peer " + (i18n.language === 'ar' && "text-end")} name={name}  value={value}
                       onChange={onChange}/>
            </label>

        </div>
    );
}

DateInput.propTypes = {
    className: PropTypes.string,
    id: PropTypes.string,
    classNameLabel: PropTypes.string,
    onChange: PropTypes.func,
    title: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
}

export default DateInput;