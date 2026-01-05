"use client";
import Modal from "../Modal/Modal.jsx";
import { IoCheckmarkCircle, IoWarning, IoTrash } from "react-icons/io5"; // استيراد أيقونة الحذف
import { RiCloseCircleFill, RiFlashlightLine, RiCheckboxCircleFill, RiDeleteBin7Fill } from "@remixicon/react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

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
                   cancelColor = "gray",
                   hideCancelBtn = false,
                   hideConfirmBtn = false
               }) {
    const { t } = useTranslation();

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
            bg: "bg-green-100",
            modalSize: "lg:w-1/4 md:w-7/12 sm:w-6/12",
            submitBtnClass: "bg-green-600 text-white hover:bg-green-700",
        },
        warning: {
            icon: (
                <div className="rounded-full p-1 bg-blue-100">
                    <div className="rounded-full p-2 bg-blue-200">
                        <RiFlashlightLine size={25} className="text-blue-600 stroke-[3px]" />
                    </div>
                </div>
            ),
            bg: "bg-blue-50",
            modalSize: "lg:w-1/3 md:w-8/12 sm:w-7/12",
            submitBtnClass: "bg-blue-600 text-white dark:bg-primary-200 dark:text-black hover:opacity-90",
        },
        delete: {
            icon: (
                <div className="rounded-full p-2 bg-red-100">
                    <div className="rounded-full p-2 bg-red-200/50">
                        <RiDeleteBin7Fill size={25} className="text-red-500" />
                    </div>
                </div>
            ),
            bg: "bg-red-50",
            modalSize: "lg:w-[28%] md:w-6/12 sm:w-5/12",
            submitBtnClass: "bg-[#E92043] text-white hover:bg-red-700", // نفس لون زر "Yes, Delete" في الصورة
        }
    };

    const currentConfig = config[type] || config.success;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className={`rounded-3xl w-11/12  ${currentConfig.modalSize}`}
            title={t(title)}
        >
            <div className="flex flex-col gap-4 justify-center items-center">
                <div className={`p-1 rounded-full text-center ${currentConfig.bg}`}>
                    {currentConfig.icon}
                </div>

                <div className="flex flex-col justify-center items-center gap-2">
                    <div className="text-center text-wrap text-md dark:text-sub-300 text-gray-600 leading-relaxed px-4">
                        {typeof message === "string" ? t(message) : message}
                    </div>
                </div>
            </div>

            {isBtns && (
                <div className="w-full pb-6 pt-4 flex px-6 items-center gap-3 border-t dark:border-gray-700">
                    {!hideCancelBtn && (
                        <button
                            onClick={handleCancel}
                            className="bg-white text-sm border border-gray-300 text-gray-700 py-3 flex-1 rounded-xl hover:bg-gray-50 transition-all font-medium"
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
    type: PropTypes.oneOf(["success", "warning", "delete"]),
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
};

export default Alert;