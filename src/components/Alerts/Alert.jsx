import Modal from "../Modal/Modal.jsx";
import { IoCheckmarkCircle, IoWarning } from "react-icons/io5";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

function Alert({
                 type,
                 title = "",
                 message,
                 isOpen,
                 onClose,
                 isBtns = false,
                 titleSubmitBtn,
                 titleCancelBtn,
                 onSubmit,
                 cancelColor = "blue", // تم تصحيح الإملاء
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

  // تحديد الإيقونة واللون بناءً على النوع
  const config = {
    success: {
      icon: <IoCheckmarkCircle size={30} className="text-green-500" />,
      bg: "bg-green-100",
      modalSize: "lg:w-1/4 md:w-7/12 sm:w-6/12",
    },
    warning: {
      icon: <IoWarning size={30} className="text-[#C2540A]" />,
      bg: "bg-orange-100",
      modalSize: "lg:w-1/3 md:w-8/12 sm:w-7/12",
    },
  };

  const currentConfig = config[type] || config.success;

  return (
      <Modal
          isOpen={isOpen}
          onClose={onClose}
          className={`rounded-2xl w-11/12 p-3 ${currentConfig.modalSize}`}
      >
        <div className="flex flex-col gap-4 justify-center items-center p-5">
          <div className={`p-2 rounded-[10px] text-center ${currentConfig.bg}`}>
            {currentConfig.icon}
          </div>
          <div className="flex flex-col justify-center items-center">
            <p className="text-center text-md dark:text-gray-200 font-semibold">
              {t(title)}
            </p>
            <p className="text-center text-wrap text-md dark:text-sub-300 text-sub-500">
              {t(message)}
            </p>
          </div>
        </div>

        {isBtns && (
            <CustomBtns
                titleSubmitBtn={titleSubmitBtn}
                titleCancelBtn={titleCancelBtn}
                onClose={handleCancel}
                onSubmit={handleSubmit}
                cancelColor={cancelColor} // تمرير الـ Prop هنا
            />
        )}
      </Modal>
  );
}

function CustomBtns({ titleSubmitBtn, titleCancelBtn, onClose, onSubmit, cancelColor = "blue" }) {
  const { t } = useTranslation();

  return (
      <div className="w-full pb-1 pt-3 flex items-center gap-3 border-t dark:border-gray-700">
        {titleCancelBtn && (
            <button
                onClick={onClose}
                className={`text-sm border flex justify-center items-center h-full text-center flex-1 p-[10px] rounded-[10px] transition-colors 
            ${cancelColor === "gray"
                    ? " border-gray-400 text-gray-500"
                    : "border-primary-base text-primary-base"}`}
            >
              {t(titleCancelBtn)}
            </button>
        )}
        {titleSubmitBtn && (
            <button
                onClick={onSubmit}
                className="bg-primary-base text-sm flex justify-center items-center h-full text-center dark:bg-primary-200 dark:text-black flex-1 text-white p-[10px] rounded-[10px]"
            >
              {t(titleSubmitBtn)}
            </button>
        )}
      </div>
  );
}

CustomBtns.propTypes = {
  titleSubmitBtn: PropTypes.string,
  titleCancelBtn: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  cancelColor: PropTypes.string,
};

Alert.propTypes = {
  type: PropTypes.oneOf(["success", "warning"]),
  title: PropTypes.string,
  message: PropTypes.string,
  isBtns: PropTypes.bool,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  titleSubmitBtn: PropTypes.string,
  titleCancelBtn: PropTypes.string,
  onSubmit: PropTypes.func,
  cancelColor: PropTypes.string,
};

export default Alert;