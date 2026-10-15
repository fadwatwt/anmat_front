"use client";

import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import DefaultButton from "../Form/DefaultButton.jsx";
import { useIsAlertOpen } from "@/store/alertStore";
import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";

const Modal = ({ isOpen, onClose, children, title, className, isHideCancel, isBtns, customBtns, classNameOpacity, btnApplyTitle, onClick, classNameBtns, disabled, bypassAlertHide }) => {
    const { t } = useTranslation()
    const isAlertOpen = useIsAlertOpen();
    const dialogRef = useRef(null);
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        if (!isOpen || (isAlertOpen && !bypassAlertHide)) return undefined;
        const previouslyFocused = document.activeElement;
        const dialog = dialogRef.current;
        const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
        const focusable = () => Array.from(dialog?.querySelectorAll(focusableSelector) || []);
        (focusable()[0] || dialog)?.focus();

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onCloseRef.current?.();
                return;
            }
            if (event.key !== "Tab") return;
            const elements = focusable();
            if (elements.length === 0) {
                event.preventDefault();
                dialog?.focus();
                return;
            }
            const first = elements[0];
            const last = elements[elements.length - 1];
            if (!dialog?.contains(document.activeElement) || document.activeElement === dialog) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            } else if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            previouslyFocused?.focus?.();
        };
    }, [isOpen, isAlertOpen, bypassAlertHide]);

    if (!isOpen || typeof document === "undefined") return null;
    return createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={title ? t(title) : undefined}
            ref={dialogRef}
            tabIndex={-1}
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
        </div>,
        document.body
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
