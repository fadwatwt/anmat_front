"use client";
import Modal from "../Modal/Modal.jsx";
import { RiCloseCircleFill, RiFlashlightLine, RiCheckboxCircleFill, RiDeleteBin7Fill } from "@remixicon/react";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAlertStore } from "@/store/alertStore";

function Alert({
    type = "success",
    title = "",
    message,
    isOpen,
    onClose,
    isBtns = false,
    titleSubmitBtn,
    titleCancelBtn,
    onSubmit,
    hideCancelBtn = false,
    hideConfirmBtn = false,
    // Auto-dismiss duration (ms) for button-less alerts. Pass false to disable,
    // or a number to override. Alerts with action buttons never auto-close.
    autoClose,
}) {
    const { t } = useTranslation();
    const open = useAlertStore((s) => s.open);
    const close = useAlertStore((s) => s.close);

    useEffect(() => {
        if (!isOpen) return;
        open();
        return close;
    }, [isOpen, open, close]);

    // Resolve the effective auto-close duration: button-less alerts default to 3s.
    const autoCloseMs =
        autoClose === false || isBtns
            ? 0
            : typeof autoClose === "number"
                ? autoClose
                : 3000;

    const [progress, setProgress] = useState(100);
    const pausedRef = useRef(false);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!isOpen || autoCloseMs <= 0) {
            setProgress(100);
            return undefined;
        }

        let elapsed = 0;
        let last = null;

        const tick = (now) => {
            if (last === null) last = now;
            const delta = now - last;
            last = now;
            // Only advance when not hovered, so hover pauses the countdown.
            if (!pausedRef.current) elapsed += delta;
            const remaining = Math.max(0, autoCloseMs - elapsed);
            setProgress((remaining / autoCloseMs) * 100);
            if (remaining <= 0) {
                onClose?.();
                return;
            }
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, autoCloseMs]);

    const handleSubmit = () => {
        onSubmit?.(true);
        onClose();
    };

    const handleCancel = () => {
        onSubmit?.(false);
        onClose();
    };

    // إعدادات التصميم بناءً على النوع (دمج خصائص CheckAlert)
    const config = {
        success: {
            icon: <RiCheckboxCircleFill size={35} className="text-green-500" />,
            bg: "bg-green-100 dark:bg-green-900/20",
            modalSize: "lg:w-1/4 md:w-7/12 sm:w-6/12",
            submitBtnClass: "bg-green-600 text-white hover:bg-green-700 shadow-green-600/20",
            progressBar: "bg-green-500",
        },
        warning: {
            icon: (
                <div className="rounded-full p-1 bg-blue-100 dark:bg-blue-900/20">
                    <div className="rounded-full p-2 bg-blue-200 dark:bg-blue-800/30">
                        <RiFlashlightLine size={25} className="text-blue-600 stroke-[3px]" />
                    </div>
                </div>
            ),
            bg: "bg-blue-50 dark:bg-blue-900/10",
            modalSize: "lg:w-1/3 md:w-8/12 sm:w-7/12",
            submitBtnClass: "bg-blue-600 text-white dark:bg-primary-500 dark:text-white hover:opacity-90 shadow-blue-600/20",
            progressBar: "bg-blue-500",
        },
        delete: {
            icon: (
                <div className="rounded-full p-2 bg-red-100 dark:bg-red-900/20">
                    <div className="rounded-full p-2 bg-red-200/50 dark:bg-red-800/30">
                        <RiDeleteBin7Fill size={25} className="text-red-500" />
                    </div>
                </div>
            ),
            bg: "bg-red-50 dark:bg-red-900/10",
            modalSize: "lg:w-[28%] md:w-6/12 sm:w-5/12",
            submitBtnClass: "bg-[#E92043] text-white hover:bg-red-700 shadow-red-500/20", // نفس لون زر "Yes, Delete" في الصورة
            progressBar: "bg-red-500",
        },
        error: {
            icon: <RiCloseCircleFill size={35} className="text-red-500" />,
            bg: "bg-red-100 dark:bg-red-900/20",
            modalSize: "lg:w-1/4 md:w-7/12 sm:w-6/12",
            submitBtnClass: "bg-red-600 text-white hover:bg-red-700 shadow-red-600/20",
            progressBar: "bg-red-500",
        }
    };

    const currentConfig = config[type] || config.success;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className={`rounded-3xl w-11/12  ${currentConfig.modalSize}`}
            title={t(title)}
            bypassAlertHide={true}
        >
            <div
                className="flex flex-col gap-5 justify-center items-center px-6 pt-2 pb-6"
                onMouseEnter={() => { pausedRef.current = true; }}
                onMouseLeave={() => { pausedRef.current = false; }}
            >
                <div className={`p-3 rounded-full text-center ${currentConfig.bg}`}>
                    {currentConfig.icon}
                </div>

                <div className="flex flex-col justify-center items-center gap-2">
                    <div className="text-center text-wrap text-md text-cell-secondary leading-relaxed">
                        {typeof message === "string" ? t(message) : message}
                    </div>
                </div>
            </div>

            {autoCloseMs > 0 && (
                <div className="w-full px-6 pb-5">
                    <div className="h-1.5 w-full rounded-full bg-status-bg overflow-hidden">
                        <div
                            className={`h-full rounded-full ${currentConfig.progressBar}`}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {isBtns && (
                <div className="w-full pb-6 pt-5 mt-1 flex px-6 items-center gap-3 border-t border-status-border">
                    {!hideCancelBtn && (
                        <button
                            onClick={handleCancel}
                            className="bg-surface text-sm border border-status-border text-cell-secondary py-3 flex-1 rounded-xl hover:bg-status-bg transition-all font-medium"
                        >
                            {t(titleCancelBtn || "Cancel")}
                        </button>
                    )}

                    {!hideConfirmBtn && (
                        <button
                            onClick={handleSubmit}
                            className={`${currentConfig.submitBtnClass} text-sm font-semibold py-3 flex-1 rounded-xl transition-all shadow-sm`}
                        >
                            {t(titleSubmitBtn || "Confirm")}
                        </button>
                    )}
                </div>
            )}
        </Modal>
    );
}

Alert.propTypes = {
    type: PropTypes.oneOf(["success", "warning", "delete", "error"]),
    title: PropTypes.string,
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    isBtns: PropTypes.bool,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    titleSubmitBtn: PropTypes.string,
    titleCancelBtn: PropTypes.string,
    onSubmit: PropTypes.func,
    cancelColor: PropTypes.string,
    hideCancelBtn: PropTypes.bool,
    hideConfirmBtn: PropTypes.bool,
    autoClose: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};

export default Alert;