import Modal from "@/components/Modal/Modal";
import { useTranslation } from "react-i18next";
import { RiCloseCircleFill, RiFlashlightLine, RiCheckboxCircleFill } from "@remixicon/react";

function CheckAlert({
                        isOpen,
                        onClose,
                        type = "cancel",
                        title,
                        description,
                        confirmBtnText,
                        cancelBtnText = "Cancel",
                        onSubmit,
                        hideCancelBtn = false,
                        hideConfirmBtn = false
                    }) {
    const { t } = useTranslation();

    const designConfigs = {
        cancel: {
            icon: <RiCloseCircleFill size={35} className="text-red-500" />,
            iconBg: "bg-red-50 dark:bg-red-900/10",
            submitBtnClass: "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20",
        },
        warning: {

            icon: (
                <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/20">
                    <div className="rounded-full p-2 bg-blue-200 dark:bg-blue-800/30">
                        <RiFlashlightLine size={25} className="text-blue-600 stroke-[3px]" />
                    </div>
                </div>
            ),
            iconBg: "bg-blue-50 dark:bg-blue-900/10",
            submitBtnClass: "bg-blue-600 text-white dark:bg-primary-500 dark:text-white hover:opacity-90 shadow-blue-600/20",
        },
        success: {
            icon: <RiCheckboxCircleFill size={35} className="text-green-500" />,
            iconBg: "bg-green-100 dark:bg-green-900/20",
        }
    };

    const config = designConfigs[type] || designConfigs.cancel;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="rounded-3xl lg:w-[28%] md:w-7/12 sm:w-6/12 w-11/12"
            title={t(title)}
        >
            <div className="flex flex-col justify-center items-center mt-4">
                <div className={`p-2 rounded-full ${config.iconBg}`}>
                    {config.icon}
                </div>

                <div className="flex flex-col justify-center items-center text-center mt-4">
                    <div className="px-8 pb-4 text-cell-secondary text-md leading-relaxed">
                        {description}
                    </div>
                </div>
            </div>

            <div className="w-full pb-6 pt-4 flex px-6 items-center gap-3 border-t border-status-border">
                {!hideCancelBtn && (
                    <button
                        onClick={onClose}
                        className="bg-surface text-sm border border-status-border text-cell-secondary h-10 flex-1 rounded-xl hover:bg-status-bg transition-all"
                    >
                        {t(cancelBtnText)}
                    </button>
                )}

                {!hideConfirmBtn &&
                    <button
                        onClick={() => {
                            if (onSubmit) onSubmit();
                            onClose();
                        }}
                        className={`${config.submitBtnClass} text-sm font-medium h-10 flex-1 rounded-xl transition-all shadow-sm`}
                    >
                        {t(confirmBtnText)}
                    </button>
                }

            </div>
        </Modal>
    );
}

export default CheckAlert;