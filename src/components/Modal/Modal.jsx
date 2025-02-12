import PropTypes from "prop-types";
import {IoClose} from "react-icons/io5";
import {useTranslation} from "react-i18next";
import DefaultButton from "../Form/DefaultButton.jsx";

const Modal = ({ isOpen, onClose, children,title,className,isBtns,customBtns,classNameOpacity,btnApplyTitle,onClick }) => {
    const {t} = useTranslation()
    if (!isOpen) return null;
    return (
        <div
            className={`fixed inset-0 bg-gray-900  flex items-center overflow-hidden justify-center z-50 ${classNameOpacity ? classNameOpacity:"bg-opacity-50"}`}
            onClick={onClose}
        >
            <div
                className={` bg-white dark:bg-gray-800 rounded-xl  shadow-lg p-4 ${className ? className : "lg:w-1/3 md:w-8/12 sm:w-7/12 w-11/12"}`}
                onClick={(e) => e.stopPropagation()} // منع إغلاق عند النقر داخل المودال
            >
                {title &&
                <div className={`flex justify-between items-center mb-4 ${title && "border-b-2"}  dark:border-gray-700 pb-3`}>
                    <h2 className="dark:text-gray-200 text-base">{t(title)}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 "
                    >
                        <IoClose size={18} />
                    </button>
                </div>
                }
                <div className={" relative flex flex-col px-1"}>
                    <div className={"max-h-[70vh] overflow-hidden tab-content overflow-y-auto"}>
                        {children}
                    </div>
                    {
                        isBtns && (
                            <div className={"flex gap-2 py-3 w-full"}>
                                <DefaultButton type={'button'} title={("Cancel")}
                                               className={"font-medium dark:text-gray-200"}/>
                                <DefaultButton onClick={onClick} type={'button'} title={btnApplyTitle ? btnApplyTitle:"Apply"}
                                               className={"bg-primary-500 font-medium dark:bg-primary-200 dark:text-black text-white"}/>
                            </div>
                        )
                    }
                    {
                        customBtns && customBtns
                    }
                </div>
            </div>
        </div>
    );
};
Modal.propTypes = {
    isOpen: PropTypes.bool,
    isBtns: PropTypes.bool,
    onClose: PropTypes.func,
    onClick: PropTypes.func,
    children: PropTypes.node,
    title: PropTypes.string,
    btnApplyTitle: PropTypes.string,
    className: PropTypes.string,
    classNameOpacity: PropTypes.string,
    customBtns:PropTypes.element
}
export default Modal;
