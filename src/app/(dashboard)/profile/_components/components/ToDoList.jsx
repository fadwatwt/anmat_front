import PropTypes from "prop-types";
import ActionsBtns from "@/components/ActionsBtns.jsx";
import useDropdown from "@/Hooks/useDropdown.js";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import {useTranslation} from "react-i18next";
import SelectWithoutLabel from "@/components/Form/SelectWithoutLabel.jsx";
import {FiPlus} from "react-icons/fi";
import AddToDoListModal from "@/app/(dashboard)/profile/_components/modals/AddToDoList.modal.jsx";
import {useState} from "react";

function ToDoList({list,isActions,isFilter,className}) {
    const [dropdownOpen, setDropdownOpen] = useDropdown();
    const {t,i18n} = useTranslation()
    const [isAddToDoModal, setIsAddToDoModal] = useState(false);
    const handleDropdownToggle = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    const handelAddToDoListModal = () => {
        setIsAddToDoModal(!isAddToDoModal)
    }

    return (
        <div className={`bg-white rounded-2xl p-4 w-full gap-4 flex flex-col dark:bg-gray-800 ${className}`}>
            <div className={"w-full flex items-center justify-between"}>
                <p className={"text-lg text-start dark:text-gray-200"}>{t("To Do List")}</p>
                <div className={"flex items-center gap-2"}>
                    {
                        isFilter && (
                            <SelectWithoutLabel title={"Today"} className={"w-[94px] h-[36px]"}/>
                        )
                    }
                    <div className={"flex gap-1 items-center cursor-pointer"} onClick={handelAddToDoListModal}>
                        <FiPlus className={"text-primary-base dark:text-primary-200"} size={15} />
                        <span className={"text-primary-base dark:text-primary-200"}>{t("Add")}</span>
                    </div>
                </div>
            </div>
            <div className={"flex flex-col w-full gap-6"}>
                {list.map((item, index) => (
                    <div className={"flex w-full justify-between items-center relative"} key={index}>
                        <div className={"flex items-center gap-2"}>
                            <input type={"checkbox"} className={"checkbox-custom"}/>
                            <p className={"text-sm text-sub-500 text-wrap dark:text-gray-300"}>{item}</p>
                        </div>
                        {isActions && (
                            <div className={"dropdown-container"}>
                            <PiDotsThreeVerticalBold
                                    className="cursor-pointer"
                                    onClick={() => handleDropdownToggle(index)}
                                />
                                {dropdownOpen === index && (
                                    <ActionsBtns handleEdit={() => {}} handleDelete={() => {}} className={`${i18n.language === "ar" ? "left-0" : "right-0"}`} />
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <AddToDoListModal isOpen={isAddToDoModal} onClose={handelAddToDoListModal} onClick={() => {}} />
        </div>
    );
}

ToDoList.propTypes = {
    list:PropTypes.array,
    isActions:PropTypes.bool,
    isFilter:PropTypes.bool,
    className:PropTypes.string

}

export default ToDoList;