import Modal from "./Modal/Modal.jsx";
import {IoCheckmarkCircle, IoWarning} from "react-icons/io5";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

function Alert({type,title,message ,isOpen,onClose ,isBtns = true,titleSubmitBtn,titleCancelBtn,onSubmit}) {
    const {t} = useTranslation()
    const handleSubmit = () => {
        onSubmit(true);
        onClose();
    };

    const handleCancel = () => {
        onSubmit(false);
        onClose();
    };
    switch (type) {
        case "success":
           return (
               <Modal isOpen={isOpen} onClose={onClose} className={"rounded-2xl lg:w-1/3 md:w-8/12 sm:w-7/12 w-11/12"} >
                   <div className={"flex flex-col gap-4 justify-center items-center p-5"} >
                       <div className={" p-2 rounded-[10px] text-center bg-green-100"}>
                           <IoCheckmarkCircle size={30} className={"text-green-500"} />
                       </div>
                       <div className={"flex flex-col justify-center items-center"}>
                           <p className={"text-center text-md dark:text-gray-200"}>{t(title)}</p>
                           <p className={"text-center text-wrap text-md dark:text-sub-300 text-sub-500 "}>{t(message)}</p>
                       </div>
                   </div>
                   {
                       isBtns &&
                       <CustomBtns titleSubmitBtn={titleSubmitBtn} titleCancelBtn={titleCancelBtn}  onClose={handleCancel}
                                   onSubmit={handleSubmit} />
                   }
               </Modal>
           )
        case "warning":
            return (
                <Modal isOpen={isOpen} onClose={onClose} className={"rounded-2xl lg:w-1/3 md:w-8/12 sm:w-7/12 w-11/12"} >
                    <div className={"flex flex-col gap-4 justify-center items-center p-5"} >
                        <div className={" p-2 rounded-[10px] text-center bg-orange-100"}>
                            <IoWarning  size={30} className={"text-[#C2540A]"} />
                        </div>
                        <div className={"flex flex-col justify-center items-center"}>
                            <p className={"text-center text-md dark:text-gray-200"}>{t(title)}</p>
                            <p className={"text-center text-wrap text-md dark:text-sub-300 text-sub-500 "}>{t(message)}</p>
                        </div>
                    </div>
                    {
                        isBtns &&
                        <CustomBtns titleSubmitBtn={titleSubmitBtn} titleCancelBtn={titleCancelBtn}  onClose={handleCancel}
                                    onSubmit={handleSubmit} />
                    }
                </Modal>
            )
    }
}

function CustomBtns ({titleSubmitBtn,titleCancelBtn ,onClose,onSubmit}) {
    const {t} = useTranslation()
    return (
        <div className={"w-full pb-1 pt-3 flex items-center  gap-3 border-t dark:border-gray-700"}>
            <button
                onClick={onClose}
                className="bg-none text-sm border border-primary-base flex justify-center items-center text-primary-base dark:border-soft-400 dark:text-soft-400 h-full text-center flex-1 p-[10px] rounded-[10px]"
            >
                {t(titleCancelBtn)}
            </button>
            <button
                onClick={onSubmit}
                className="bg-primary-base text-sm flex justify-center items-center h-full text-center dark:bg-primary-200 dark:text-black flex-1 text-white p-[10px] rounded-[10px]"
            >
                {t(titleSubmitBtn)}
            </button>
        </div>
    )
}

CustomBtns.propTypes = {
    titleSubmitBtn: PropTypes.string,
    titleCancelBtn: PropTypes.string,
    onSubmit:PropTypes.func,
    onClose:PropTypes.func
}

Alert.propTypes = {
    title: PropTypes.string,
    type: PropTypes.string,
    message: PropTypes.string,
    isBtns:PropTypes.bool,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    titleSubmitBtn: PropTypes.string,
    titleCancelBtn: PropTypes.string,
    onSubmit:PropTypes.func
}

export default Alert;