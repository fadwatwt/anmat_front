import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import DefaultButton from "../Form/DefaultButton.jsx";
import { useIsAlertOpen } from "@/store/alertStore";

const Modal = ({ isOpen, onClose, children, title, className, isHideCancel, isBtns, customBtns, classNameOpacity, btnApplyTitle, onClick, classNameBtns, disabled, bypassAlertHide }) => {
    const { t } = useTranslation()
    const isAlertOpen = useIsAlertOpen();
    if (!isOpen) return null;
    if (isAlertOpen && !bypassAlertHide) return null;
    return (
        <div
            className={`fixed inset-0  bg-black/30 dark:bg-black/60 backdrop-blur-sm flex items-center overflow-hidden justify-center z-50 ${classNameOpacity ? classNameOpacity : ""}`}
            onClick={onClose}
        >
            <div
                className={`bg-surface rounded-xl shadow-lg border border-status-border ${className ? className : "lg:w-1/3 md:w-8/12 sm:w-7/12 w-11/12 p-4"}`}
                onClick={(e) => e.stopPropagation()} // منع إغلاق عند النقر داخل المودال
            >
                {title &&
                    <div className={`flex justify-between items-center mb-4 ${title && "border-b"} border-status-border p-3`}>
                        <h2 className="text-table-title text-base font-semibold">{t(title)}</h2>
                        <button
                            onClick={onClose}
                            className="text-cell-secondary hover:text-table-title transition-colors"
                        >
                            <IoClose size={20} />
                        </button>
                    </div>
                }
                <div className={" relative flex flex-col"}>
                    <div className={"max-h-[70vh] overflow-visible tab-content overflow-y-auto"}>
                        {children}
                    </div>
                    {
                        isBtns && (
                            <div className={"flex gap-2 py-3 w-full p-4 " + classNameBtns}>
                                {
                                    !isHideCancel &&
                                    <DefaultButton type={'button'} title={("Cancel")}
                                        className={"font-medium text-cell-secondary"} />
                                }

                                <DefaultButton onClick={onClick} type={'button'} title={btnApplyTitle ? btnApplyTitle : "Apply"}
                                    disabled={disabled}
                                    className={"bg-primary-500 font-medium text-white hover:bg-primary-600 transition-colors"} />
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
    customBtns: PropTypes.element,
    classNameBtns: PropTypes.string,
    isHideCancel: PropTypes.bool,
    disabled: PropTypes.bool,
    bypassAlertHide: PropTypes.bool,
}
export default Modal;
