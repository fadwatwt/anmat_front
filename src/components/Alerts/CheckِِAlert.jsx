
import Modal from "@/components/Modal/Modal";
import {useTranslation} from "react-i18next";
import {RiCloseCircleFill} from "@remixicon/react";

function CheckAlert({isOpen,onClose,title,feature,subFeature,isBtns,titleSubmitBtn,titleCancelBtn,onSubmit }) {
    const { t } = useTranslation();
    const handleSubmit = () => {
        onSubmit(true);
        onClose();
    };

    const handleCancel = () => {
        onSubmit(false);
        onClose();
    };
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className={"rounded-2xl lg:w-1/4 md:w-7/12 sm:w-6/12 w-11/12"}
            title={t(title)}
        >
            <div
                className={"flex flex-col gap-4 justify-center items-center p-5"}
            >
                <div className={" p-2 rounded-full text-center bg-red-100"}>
                    <RiCloseCircleFill size={30} className={"text-red-500"} />
                </div>
                <div className={"flex flex-col justify-center items-center"}>
                    <p
                        className={
                            "text-center px-4 text-wrap text-md dark:text-sub-300 text-sub-500 text-lg text-black "
                        }
                    >
                        Are you sure you want to <span className={"font-bold"}>{subFeature}</span> of your <span className={"font-bold"}>{feature}</span> ?
                    </p>
                </div>
            </div>
            {isBtns && (
                <div
                    className={
                        "w-full pb-1 pt-3 flex px-5 pb-6 items-center  gap-3 border-t dark:border-gray-700"
                    }
                >
                    <button
                        onClick={handleCancel}
                        className="bg-none text-sm border border-gray-400 flex justify-center items-center text-gray-800 dark:border-soft-400 dark:text-soft-400 h-full text-center flex-1 p-[10px] rounded-[10px]"
                    >
                        {t(titleCancelBtn)}
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-red-500 text-sm flex justify-center items-center h-full text-center dark:bg-primary-200 dark:text-black flex-1 text-white p-[10px] rounded-[10px]"
                    >
                        {t(titleSubmitBtn)}
                    </button>
                </div>
            )}
        </Modal>
    );
}

export default CheckAlert;