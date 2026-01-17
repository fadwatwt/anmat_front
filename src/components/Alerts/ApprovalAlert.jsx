import Modal from "@/components/Modal/Modal";
import { useTranslation } from "react-i18next";
import { RiDeleteBin7Fill, RiInformationLine, RiErrorWarningLine } from "@remixicon/react";
import PropTypes from "prop-types";

function ApprovalAlert({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmBtnText = "Confirm",
    cancelBtnText = "Cancel",
    type = "warning", // 'warning', 'danger', 'info'
}) {
    const { t } = useTranslation();

    const configs = {
        warning: {
            icon: <RiErrorWarningLine size={35} className="text-yellow-500" />,
            iconBg: "bg-yellow-50",
            confirmBtnClass: "bg-yellow-500 hover:bg-yellow-600 text-white",
        },
        danger: {
            icon: <RiDeleteBin7Fill size={35} className="text-red-500" />,
            iconBg: "bg-red-50",
            confirmBtnClass: "bg-red-500 hover:bg-red-600 text-white",
        },
        info: {
            icon: <RiInformationLine size={35} className="text-blue-500" />,
            iconBg: "bg-blue-50",
            confirmBtnClass: "bg-blue-500 hover:bg-blue-600 text-white",
        }
    };

    const config = configs[type] || configs.warning;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="rounded-3xl lg:w-[28%] md:w-7/12 sm:w-6/12 w-11/12"
            title={t(title)}
        >
            <div className="flex flex-col justify-center items-center mt-6">
                <div className={`p-4 rounded-full ${config.iconBg}`}>
                    {config.icon}
                </div>

                <div className="flex flex-col justify-center items-center text-center mt-4 mb-6">
                    <p className="px-8 text-gray-700 dark:text-gray-300 text-md leading-relaxed">
                        {t(message)}
                    </p>
                </div>
            </div>

            <div className="w-full pb-6 pt-4 flex px-6 items-center gap-3 border-t dark:border-gray-700">
                <button
                    onClick={onClose}
                    className="bg-white text-sm border border-gray-300 text-gray-700 h-11 flex-1 rounded-xl hover:bg-gray-50 transition-all font-medium"
                >
                    {t(cancelBtnText)}
                </button>
                <button
                    onClick={() => {
                        onConfirm?.();
                        onClose();
                    }}
                    className={`${config.confirmBtnClass} text-sm font-semibold h-11 flex-1 rounded-xl transition-all shadow-sm`}
                >
                    {t(confirmBtnText)}
                </button>
            </div>
        </Modal>
    );
}

ApprovalAlert.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    title: PropTypes.string,
    message: PropTypes.string,
    confirmBtnText: PropTypes.string,
    cancelBtnText: PropTypes.string,
    type: PropTypes.oneOf(["warning", "danger", "info"]),
};

export default ApprovalAlert;
