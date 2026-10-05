import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import DefaultButton from "../Form/DefaultButton.jsx";
import { useIsAlertOpen } from "@/store/alertStore";

const Modal = ({ isOpen, onClose, children, title, className, isHideCancel, isBtns, customBtns, classNameOpacity, btnApplyTitle, onClick, classNameBtns, disabled, bypassAlertHide }) => {
    const { t } = useTranslation()
    const isAlertOpen = useIsAlertOpen();
    if (!isOpen) return null;
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title ? t(title) : undefined}
            className={`fixed inset-0 bg-black/40 dark:bg-black/70 backdrop-blur-sm flex items-center overflow-hidden justify-center z-[100] p-4 animate-scale-in ${classNameOpacity ? classNameOpacity : ""} ${isAlertOpen && !bypassAlertHide ? "hidden" : ""}`}
            onClick={onClose}
        >
            <div
                className={`bg-surface rounded-2xl shadow-xl border border-status-border w-full ${className ? className : "max-w-lg p-0"} max-h-[85vh] flex flex-col overflow-hidden`}
                onClick={(e) => e.stopPropagation()} // منع إغلاق عند النقر داخل المودال
            >
                {title &&
                    <div className={`flex justify-between items-center shrink-0 ${title && "border-b"} border-status-border px-5 py-4`}>
                        <h2 className="text-table-title text-base font-semibold">{t(title)}</h2>
                        <button
                            onClick={onClose}
                            aria-label={t("Close")}
                            className="p-1.5 rounded-lg text-cell-secondary hover:text-table-title hover:bg-status-bg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base"
                        >
                            <IoClose size={20} />
                        </button>
                    </div>
                }
                <div className={" relative flex flex-col min-h-0"}>
                    <div className={"max-h-[70vh] overflow-y-auto custom-scroll px-5 py-4"}>
                        {children}
                    </div>
                    {
                        isBtns && (
                            <div className={"flex gap-3 w-full px-5 py-4 border-t border-status-border shrink-0 " + classNameBtns}>
                                {
                                    !isHideCancel &&
                                    <DefaultButton type={'button'} title={("Cancel")} onClick={onClose}
                                        variant="secondary"
                                        className={"flex-1"} />
                                }

                                <DefaultButton onClick={onClick} type={'button'} title={btnApplyTitle ? btnApplyTitle : "Apply"}
                                    disabled={disabled}
                                    variant="primary"
                                    className={"flex-1"} />
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
