import {RiDeleteBin7Line, RiEdit2Line} from "react-icons/ri";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";

function ActionsBtns({handleEdit,handleDelete,className,isEditBtn = true,isDeleteBtn = true}) {
    const {t} = useTranslation()
    return (
        <div
            className={`absolute z-10 flex flex-col  mt-2 w-40 bg-white dark:bg-white-0 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
            { isEditBtn &&
                <button
                onClick={handleEdit}
                className="w-full px-3 py-3 text-sm border-b dark:border-gray-700 dark:text-gray-200 flex gap-2 items-center text-left text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
                <RiEdit2Line className={"text-primary-500 text-sm "}/> {t("Edit")}
            </button>
            }
            { isDeleteBtn  &&
                <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-sm text-left flex items-center  text-gray-700 gap-2 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
                <RiDeleteBin7Line className={"text-red-500 text-sm"}/>
                {t("Delete")}
            </button>
            }
        </div>
    );
}

ActionsBtns.propTypes = {
    handleEdit: PropTypes.func,
    handleDelete: PropTypes.func,
    className:PropTypes.string,
    isEditBtn:PropTypes.bool,
    isDeleteBtn:PropTypes.bool
}

export default ActionsBtns;